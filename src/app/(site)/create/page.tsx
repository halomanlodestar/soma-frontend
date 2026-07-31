/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Image as ImageIcon, UploadCloud } from "lucide-react";

import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
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
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      somaId: "",
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!uploadedFile) {
      alert("Please upload an image of your artwork.");
      return;
    }
    const selectedSoma = somas?.find((s) => s.id === values.somaId);
    router.push(`/s/${selectedSoma?.slug || "visual-arts"}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const clearUpload = () => {
    setImagePreview(null);
    setUploadedFile(null);
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
            <div
              className={`relative flex min-h-92 w-full flex-col items-center justify-center overflow-hidden border border-dashed transition-colors duration-200 sm:min-h-120
                ${imagePreview ? "border-border bg-secondary/40" : isDragging ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/50 hover:bg-secondary"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview && uploadedFile ? (
                <div className="relative flex h-full w-full flex-col items-center justify-center p-5 sm:p-7">
                  <div className="relative mb-5 w-full flex-1 overflow-hidden bg-muted/30">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <Attachment
                    size="default"
                    className="w-full max-w-sm border-border bg-background shadow-none"
                  >
                    <AttachmentMedia variant="image">
                      <Image
                        src={imagePreview}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{uploadedFile.name}</AttachmentTitle>
                      <AttachmentDescription>
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction
                        type="button"
                        variant="ghost"
                        onClick={clearUpload}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                </div>
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

              {/* Hidden File Input covering the entire dropzone if no image */}
              {!imagePreview && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              )}
            </div>
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
                    data-invalid={errors.somaId ? "" : undefined}
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
                      defaultValue={field.value}
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
                      <FieldDescription className="text-destructive font-medium">
                        {errors.somaId.message}
                      </FieldDescription>
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
                    data-invalid={errors.title ? "" : undefined}
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
                    {errors.title && (
                      <FieldDescription className="text-destructive font-medium">
                        {errors.title.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <Field
                    data-invalid={errors.content ? "" : undefined}
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
                    {errors.content && (
                      <FieldDescription className="text-destructive font-medium">
                        {errors.content.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="mt-7 flex justify-end">
              <Button type="submit" className="h-11 w-full gap-2 sm:w-auto">
                <UploadCloud className="size-4" />
                Publish work
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
