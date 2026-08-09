/** @format */

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Info,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { useCreatePost } from "@/modules/post/api/useCreatePost";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  deleteDraftMedia,
  getDraftMedia,
  saveDraftMedia,
} from "@/modules/post/drafts/localDraftMedia";
import { usePostDraftStore } from "@/modules/post/drafts/usePostDraftStore";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 20 * 1024 * 1024;
const steps = [
  { id: 1, label: "The work" },
  { id: 2, label: "Its story" },
  { id: 3, label: "Its home" },
] as const;

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

const formSchema = z.object({
  media: z
    .custom<File | null>()
    .refine(
      (file) => Boolean(isFile(file)),
      "Please upload an image of your artwork",
    )
    .refine(
      (file) => !isFile(file) || acceptedImageTypes.includes(file.type),
      "Use a JPEG, PNG, or WebP image",
    )
    .refine(
      (file) => !isFile(file) || file.size <= maxImageSize,
      "Image must be 20MB or smaller",
    ),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title is too long"),
  somaId: z.string().min(1, "Please select a community to post to"),
  content: z
    .string()
    .min(10, "Please provide some context, process, or story about your art"),
});

type CreatePostValues = z.infer<typeof formSchema>;
type Step = (typeof steps)[number]["id"];

function makeDraftId() {
  return globalThis.crypto?.randomUUID?.() ?? `draft-${Date.now()}`;
}

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedDraftId = searchParams.get("draft");
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  const { createPost, uploadProgress } = useCreatePost();
  const drafts = usePostDraftStore((state) => state.drafts);
  const hasHydrated = usePostDraftStore((state) => state.hasHydrated);
  const saveDraft = usePostDraftStore((state) => state.saveDraft);
  const removeDraft = usePostDraftStore((state) => state.removeDraft);
  const [step, setStep] = useState<Step>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(
    requestedDraftId,
  );
  const [isDraftReady, setIsDraftReady] = useState(() => !requestedDraftId);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const didLoadDraft = useRef(false);

  const methods = useForm<CreatePostValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { media: null, title: "", somaId: "", content: "" },
  });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;
  const values = useWatch({ control });
  const uploadedFile = values.media;

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!hasHydrated || didLoadDraft.current) return;

    didLoadDraft.current = true;
    if (!requestedDraftId) return;

    const draft = drafts.find((item) => item.id === requestedDraftId);
    if (!draft) {
      router.replace("/create");
      window.requestAnimationFrame(() => {
        setActiveDraftId(null);
        setIsDraftReady(true);
      });
      return;
    }

    reset({
      title: draft.title,
      content: draft.content,
      somaId: draft.somaId,
      media: null,
    });
    void getDraftMedia(draft.id)
      .then((file) => {
        if (!file) return;
        setValue("media", file, { shouldDirty: false });
        setImagePreview(URL.createObjectURL(file));
      })
      .finally(() => setIsDraftReady(true));
  }, [drafts, hasHydrated, requestedDraftId, reset, router, setValue]);

  useEffect(() => {
    if (!hasHydrated || !isDraftReady) return;

    const hasMeaningfulWork = Boolean(
      values.media ||
      values.title?.trim() ||
      values.content?.trim() ||
      values.somaId,
    );
    if (!hasMeaningfulWork) return;

    const timeout = window.setTimeout(() => {
      const id = activeDraftId ?? makeDraftId();
      const existingDraft = usePostDraftStore
        .getState()
        .drafts.find((draft) => draft.id === id);
      const now = new Date().toISOString();
      const removedIds = saveDraft({
        id,
        title: values.title ?? "",
        content: values.content ?? "",
        somaId: values.somaId ?? "",
        mediaName: values.media?.name ?? null,
        createdAt: existingDraft?.createdAt ?? now,
        updatedAt: now,
      });

      if (values.media) {
        void saveDraftMedia(id, values.media);
      } else {
        void deleteDraftMedia(id);
      }
      removedIds.forEach((removedId) => void deleteDraftMedia(removedId));
      setActiveDraftId(id);
      setLastSavedAt(now);

      if (!requestedDraftId) {
        router.replace(`/create?draft=${encodeURIComponent(id)}`, {
          scroll: false,
        });
      }
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [
    activeDraftId,
    hasHydrated,
    isDraftReady,
    requestedDraftId,
    router,
    saveDraft,
    values,
  ]);

  const setUploadedImage = (file: File | null) => {
    setValue("media", file, { shouldDirty: true, shouldValidate: true });

    if (!file || !file.type.startsWith("image/")) {
      setImagePreview(null);
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const continueTo = async (nextStep: Step) => {
    const fields: Array<keyof CreatePostValues> =
      step === 1 ? ["media"] : step === 2 ? ["title", "content"] : ["somaId"];
    const isValid = await trigger(fields);
    if (!isValid) return;
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (submission: CreatePostValues) => {
    if (!submission.media) return;

    try {
      await createPost({
        file: submission.media,
        somaId: submission.somaId,
        title: submission.title,
        body: submission.content,
      });

      if (activeDraftId) {
        removeDraft(activeDraftId);
        await deleteDraftMedia(activeDraftId).catch(() => undefined);
      }

      toast.success("Your work is being prepared for publication.");
      router.push("/studio");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not publish this work.";
      setError("root", { message });
      toast.error(message);
    }
  };

  if (!isDraftReady) {
    return <CreateSkeleton />;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <p className="font-heading text-xl font-medium tracking-[-0.03em] text-foreground">
            Share work
          </p>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {lastSavedAt ? "Saved locally" : "Local draft"}
          </p>
        </div>
        {step === 1 && (
          <Controller
            control={control}
            name="media"
            render={({ field }) => (
              <Field
                data-invalid={errors.media ? true : undefined}
                className={cn(
                  "relative flex aspect-4/3 min-h-92 w-full flex-col items-center justify-center overflow-hidden border border-dashed transition-colors duration-200 sm:min-h-120",
                  imagePreview
                    ? "border-border bg-secondary/40"
                    : isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/40 hover:border-primary/50 hover:bg-secondary",
                )}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  setUploadedImage(event.dataTransfer.files?.[0] ?? null);
                }}
              >
                {imagePreview && uploadedFile ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt={`Preview of ${uploadedFile.name}`}
                      fill
                      className="object-contain p-5 sm:p-7"
                      unoptimized
                    />
                    <div className="absolute top-5 right-5 flex gap-2 sm:top-7 sm:right-7">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label="Inspect uploaded image"
                            className="bg-background/90"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="gap-0 p-0 sm:max-w-sm">
                          <DialogHeader className="border-b border-border px-6 pt-6 pb-5">
                            <DialogTitle className="text-xl tracking-[-0.025em]">
                              {uploadedFile.name}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 px-6 py-5 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Type
                              </p>
                              <p className="mt-1 font-medium">
                                {uploadedFile.type || "Image"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Size
                              </p>
                              <p className="mt-1 font-medium">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Remove uploaded image"
                        onClick={() => setUploadedImage(null)}
                        className="bg-background/90 text-destructive hover:text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="pointer-events-none flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <ImageIcon className="size-5" />
                    </div>
                    <h2 className="font-heading text-2xl font-medium tracking-[-0.02em] text-foreground">
                      Bring your work in
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      Drop an image here, or choose one from your device. JPEG,
                      PNG, or WebP up to 20MB.
                    </p>
                  </div>
                )}
                {!imagePreview && (
                  <>
                    <FieldLabel htmlFor="media" className="sr-only">
                      Artwork image
                    </FieldLabel>
                    <Input
                      id="media"
                      name={field.name}
                      ref={field.ref}
                      type="file"
                      accept={acceptedImageTypes.join(",")}
                      aria-invalid={errors.media ? true : undefined}
                      className="absolute inset-0 size-full cursor-pointer border-0 opacity-0"
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        setUploadedImage(event.target.files?.[0] ?? null)
                      }
                    />
                  </>
                )}
                <FieldError
                  errors={errors.media ? [errors.media] : undefined}
                  className="absolute right-4 bottom-4 left-4 bg-background/90 px-3 py-2 text-center"
                />
              </Field>
            )}
          />
        )}

        {step === 2 && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <PreviewPanel imagePreview={imagePreview} title={values.title} />
            <FieldGroup className="gap-7">
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Field data-invalid={errors.title ? true : undefined}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Give the work a name"
                      aria-invalid={errors.title ? true : undefined}
                      className="h-11 text-base"
                      {...field}
                    />
                    <FieldError
                      errors={errors.title ? [errors.title] : undefined}
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <Field data-invalid={errors.content ? true : undefined}>
                    <FieldLabel htmlFor="content">
                      The story behind it
                    </FieldLabel>
                    <Textarea
                      id="content"
                      placeholder="What drew you to this? What should someone notice, wonder about, or know about the process?"
                      aria-invalid={errors.content ? true : undefined}
                      className="min-h-56 resize-y p-3 text-base leading-7"
                      {...field}
                    />
                    <FieldDescription>
                      A little context helps the right people linger with the
                      work.
                    </FieldDescription>
                    <FieldError
                      errors={errors.content ? [errors.content] : undefined}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <PreviewPanel imagePreview={imagePreview} title={values.title} />
            <FieldGroup className="gap-8">
              <Controller
                control={control}
                name="somaId"
                render={({ field }) => (
                  <Field data-invalid={errors.somaId ? true : undefined}>
                    <FieldLabel htmlFor="somaId">Choose a Soma</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={somasLoading}
                    >
                      <SelectTrigger
                        id="somaId"
                        aria-invalid={errors.somaId ? true : undefined}
                        className="h-11"
                      >
                        <SelectValue placeholder="Select a Soma to post in" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {somas?.map((soma) => (
                            <SelectItem key={soma.id} value={soma.id}>
                              s/{soma.slug} — {soma.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Find the room where this work belongs.
                    </FieldDescription>
                    <FieldError
                      errors={errors.somaId ? [errors.somaId] : undefined}
                    />
                  </Field>
                )}
              />
              <div className="border-y border-border py-5">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                  Ready to share
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your work will be prepared and published once its media is
                  ready.
                </p>
              </div>
            </FieldGroup>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-3"
            aria-label={`Step ${step} of 3`}
          >
            <span className="text-xs text-muted-foreground">
              Step {step} of 3
            </span>
            <span className="flex gap-1.5" aria-hidden="true">
              {steps.map((item) => (
                <span
                  key={item.id}
                  className={cn(
                    "h-1 w-6 rounded-full",
                    item.id <= step ? "bg-primary" : "bg-border",
                  )}
                />
              ))}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep((step - 1) as Step)}
              >
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => void continueTo((step + 1) as Step)}
              >
                Continue
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <UploadCloud
                    data-icon="inline-start"
                    className="animate-pulse"
                  />
                )}
                {uploadProgress !== null
                  ? `Uploading ${uploadProgress}%`
                  : isSubmitting
                    ? "Preparing work…"
                    : "Publish work"}
              </Button>
            )}
          </div>
        </div>
        <FieldError
          errors={errors.root ? [errors.root] : undefined}
          className="mt-4"
        />
      </form>
    </FormProvider>
  );
}

function PreviewPanel({
  imagePreview,
  title,
}: {
  imagePreview: string | null;
  title?: string;
}) {
  return (
    <div className="relative aspect-4/3 overflow-hidden border border-border bg-secondary/40">
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt={title ? `Preview of ${title}` : "Artwork preview"}
          fill
          className="object-contain p-4 sm:p-6"
          unoptimized
        />
      ) : (
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          Your artwork preview will appear here.
        </div>
      )}
    </div>
  );
}

function CreateSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-4 h-12 w-72" />
      <Skeleton className="mt-10 aspect-4/3 w-full" />
    </main>
  );
}
