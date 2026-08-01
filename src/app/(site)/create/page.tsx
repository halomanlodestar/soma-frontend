/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Image as ImageIcon, Info, Trash2, UploadCloud } from "lucide-react";

import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { useCreatePost } from "@/modules/post/api/useCreatePost";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 20 * 1024 * 1024;

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

export default function CreatePostPage() {
  const router = useRouter();
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  const { publishPost } = useCreatePost();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      media: null,
      title: "",
      somaId: "",
      content: "",
    },
  });

  const uploadedFile = watch("media");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.media) return;

    try {
      const post = await publishPost({
        file: values.media,
        somaId: values.somaId,
        title: values.title,
        body: values.content,
      });
      toast.success("Your work is with the Soma for review.");
      router.push(`/s/${post.soma.slug}/posts/${post.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not publish this work.";
      setError("root", { message });
      toast.error(message);
    }
  };

  const setUploadedImage = (file: File | null) => {
    setValue("media", file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!file || !file.type.startsWith("image/")) {
      setImagePreview(null);
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadedImage(e.dataTransfer.files?.[0] ?? null);
  };

  const clearUpload = () => {
    setValue("media", null, { shouldDirty: true, shouldValidate: true });
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              Share a work
            </p>
            <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
              Make room for what you made.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Share the work, then leave a little of the story behind it for the
              people who find it.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div className="lg:col-span-7">
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
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview && uploadedFile ? (
                    <>
                  <Image
                    src={imagePreview}
                    alt={`Preview of ${uploadedFile.name}`}
                    fill
                    className="object-contain p-5 sm:p-7"
                  />
                  <div className="absolute top-5 right-5 z-10 flex gap-2 sm:top-7 sm:right-7">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Inspect uploaded image"
                          className="size-9 bg-background/90 supports-backdrop-filter:backdrop-blur-sm"
                        >
                          <Info />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="gap-0 p-0 sm:max-w-sm">
                        <DialogHeader className="border-b border-border px-6 pt-6 pb-5">
                          <DialogTitle className="font-heading text-xl font-medium tracking-[-0.025em]">
                            {uploadedFile.name}
                          </DialogTitle>
                          <DialogDescription className="mt-1 text-sm">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 px-6 py-5 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="mt-1 font-medium text-foreground">{uploadedFile.type || "Image"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Size</p>
                            <p className="mt-1 font-medium text-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Remove uploaded image"
                      onClick={clearUpload}
                      className="size-9 bg-background/90 text-destructive supports-backdrop-filter:backdrop-blur-sm hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </>
                  ) : (
                    <div className="pointer-events-none z-10 flex flex-col items-center justify-center p-6 text-center">
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
                    className="absolute right-4 bottom-4 left-4 z-20 bg-background/90 px-3 py-2 text-center supports-backdrop-filter:backdrop-blur-sm"
                  />
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="border-y border-border py-6 sm:py-7">
              <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
                A little context
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A clear title and a few words help the right people linger with
                the work.
              </p>
            </div>
            <FieldGroup className="flex flex-col">
              <Controller
                control={control}
                name="somaId"
                render={({ field }) => (
                  <Field
                    data-invalid={errors.somaId ? true : undefined}
                    className="border-b border-border py-6 sm:py-7"
                  >
                    <FieldLabel
                      htmlFor="somaId"
                      className="font-medium text-foreground"
                    >
                      Choose a Soma
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      name={field.name}
                      value={field.value}
                      disabled={somasLoading}
                    >
                      <SelectTrigger
                        id="somaId"
                        aria-invalid={errors.somaId ? true : undefined}
                        className="mt-2 h-11 border-border bg-background focus:ring-primary/20"
                      >
                        <SelectValue placeholder="Select a Soma to post in" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {somas?.map((soma) => (
                            <SelectItem key={soma.id} value={soma.id}>
                              s/{soma.slug} - {soma.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.somaId ? (
                      <FieldError>
                        {errors.somaId.message}
                      </FieldError>
                    ) : (
                      <FieldDescription>
                        Find the room where this work belongs.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Field
                    data-invalid={errors.title ? true : undefined}
                    className="border-b border-border py-6 sm:py-7"
                  >
                    <FieldLabel
                      htmlFor="title"
                      className="font-medium text-foreground"
                    >
                      Title
                    </FieldLabel>
                    <Input
                      id="title"
                      placeholder="Give the work a name"
                      aria-invalid={errors.title ? true : undefined}
                      className="mt-2 h-11 border-border bg-background text-base focus-visible:ring-primary/20"
                      {...field}
                    />
                    <FieldError errors={errors.title ? [errors.title] : undefined} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <Field
                    data-invalid={errors.content ? true : undefined}
                    className="flex flex-col border-b border-border py-6 sm:py-7"
                  >
                    <FieldLabel
                      htmlFor="content"
                      className="font-medium text-foreground"
                    >
                      The story behind it
                    </FieldLabel>
                    <Textarea
                      id="content"
                      placeholder="What drew you to this? What should someone notice, wonder about, or know about the process?"
                      aria-invalid={errors.content ? true : undefined}
                      className="mt-2 min-h-48 resize-none border-border bg-background p-3 text-base leading-7 focus-visible:ring-primary/20"
                      {...field}
                    />
                    <FieldError errors={errors.content ? [errors.content] : undefined} />
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="mt-7 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full gap-2 sm:w-auto"
              >
                <UploadCloud className="size-4" />
                {isSubmitting ? "Publishing work…" : "Publish work"}
              </Button>
            </div>
            <FieldError errors={errors.root ? [errors.root] : undefined} />
          </div>
        </form>
      </div>
    </div>
  );
}
