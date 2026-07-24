/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
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
  AttachmentAction
} from "@/components/ui/attachment";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(80, "Title is too long"),
  somaId: z.string().min(1, "Please select a community to post to"),
  content: z.string().min(10, "Please provide some context, process, or story about your art"),
});

export default function CreatePostPage() {
  const router = useRouter();
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
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
    const selectedSoma = somas?.find(s => s.id === values.somaId);
    router.push(`/s/${selectedSoma?.slug || 'visual-arts'}`);
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
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="w-full bg-card border-b border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight">Create a New Post</h1>
          <p className="text-muted-foreground mt-2">Share your human-made art with the world. No generative AI allowed.</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Image Upload */}
          <div className="lg:col-span-7 flex flex-col h-[60vh] lg:h-[75vh]">
            <div 
              className={`relative w-full h-full rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden flex flex-col items-center justify-center
                ${imagePreview ? 'border-border bg-card' : isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-accent/10 hover:border-border/80'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview && uploadedFile ? (
                <div className="flex flex-col items-center justify-center w-full h-full p-6 relative">
                  <div className="relative w-full flex-1 mb-6 rounded-xl overflow-hidden bg-muted/30">
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <Attachment size="default" className="w-full max-w-sm shadow-sm bg-background border-border/60">
                    <AttachmentMedia variant="image">
                      <Image src={imagePreview} alt="Thumbnail" fill className="object-cover" />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{uploadedFile.name}</AttachmentTitle>
                      <AttachmentDescription>
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction type="button" variant="ghost" onClick={clearUpload}>
                        <Trash2 className="size-4 text-destructive" />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                  <div className="size-16 rounded-full bg-accent flex items-center justify-center mb-4">
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Drag and drop your artwork here</h3>
                  <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                    High-resolution JPEG, PNG, or WebP. Max 20MB.
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

          {/* RIGHT COLUMN: Form Fields */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col gap-6 h-full">
              
              <FieldGroup className="flex-1 flex flex-col gap-6">
                
                <Controller
                  control={control}
                  name="somaId"
                  render={({ field }) => (
                    <Field data-invalid={errors.somaId ? "" : undefined}>
                      <FieldLabel htmlFor="somaId" className="text-foreground font-semibold">Community (Soma)</FieldLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value} 
                        disabled={somasLoading}
                      >
                        <SelectTrigger id="somaId" aria-invalid={errors.somaId ? true : undefined} className="h-12 bg-background border-border/60 focus:ring-primary/20">
                          <SelectValue placeholder="Select a Soma to post in" />
                        </SelectTrigger>
                        <SelectContent>
                          {somas?.map(soma => (
                            <SelectItem key={soma.id} value={soma.id}>
                              s/{soma.slug} - {soma.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.somaId ? (
                        <FieldDescription className="text-destructive font-medium">{errors.somaId.message}</FieldDescription>
                      ) : (
                        <FieldDescription>Choose the community that best fits your art style.</FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Field data-invalid={errors.title ? "" : undefined}>
                      <FieldLabel htmlFor="title" className="text-foreground font-semibold">Title</FieldLabel>
                      <Input 
                        id="title"
                        placeholder="Give your masterpiece a name..." 
                        aria-invalid={errors.title ? true : undefined}
                        className="h-12 bg-background border-border/60 focus-visible:ring-primary/20 text-base font-medium"
                        {...field} 
                      />
                      {errors.title && (
                        <FieldDescription className="text-destructive font-medium">{errors.title.message}</FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <Field data-invalid={errors.content ? "" : undefined} className="flex-1 flex flex-col">
                      <FieldLabel htmlFor="content" className="text-foreground font-semibold">Story & Process</FieldLabel>
                      <Textarea 
                        id="content"
                        placeholder="What inspired you? What tools did you use? Share the human struggle behind this piece..." 
                        aria-invalid={errors.content ? true : undefined}
                        className="flex-1 min-h-[200px] resize-none bg-background border-border/60 focus-visible:ring-primary/20 text-base p-4"
                        {...field} 
                      />
                      {errors.content && (
                        <FieldDescription className="text-destructive font-medium">{errors.content.message}</FieldDescription>
                      )}
                    </Field>
                  )}
                />

              </FieldGroup>

              <div className="pt-4 border-t border-border/40 mt-auto shrink-0">
                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md gap-2 rounded-xl">
                  <UploadCloud className="size-5" />
                  Publish Artwork
                </Button>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
