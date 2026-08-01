/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const createSomaSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(30).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Provide a better description").max(200),
});

export default function CreateCommunityPage() {
  const router = useRouter();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof createSomaSchema>>({
    resolver: zodResolver(createSomaSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createSomaSchema>) => {
    // Mock network request
    await new Promise(r => setTimeout(r, 800));
    console.log("Created Soma:", values);
    router.push(`/s/${values.slug}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="w-full bg-card border-b border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-heading font-bold tracking-tight">Create a Community</h1>
          <p className="text-muted-foreground mt-1">Start a new Soma for artists to gather and share their work.</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe2 className="size-5 text-primary" />
            Soma Details
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <FieldGroup className="flex flex-col gap-6">
              
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Field data-invalid={errors.name ? "" : undefined}>
                    <FieldLabel htmlFor="name" className="font-semibold">Community Name</FieldLabel>
                    <Input 
                      id="name"
                      placeholder="e.g. Minimalist Photography"
                      aria-invalid={errors.name ? true : undefined}
                      className="bg-background focus-visible:ring-primary/20"
                      {...field} 
                    />
                    {errors.name ? (
                      <FieldDescription className="text-destructive font-medium">{errors.name.message}</FieldDescription>
                    ) : (
                      <FieldDescription>The public display name for your community.</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <Field data-invalid={errors.slug ? "" : undefined}>
                    <FieldLabel htmlFor="slug" className="font-semibold">Soma Tag (URL)</FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-muted-foreground font-semibold sm:text-sm">s/</span>
                      </div>
                      <Input 
                        id="slug"
                        placeholder="minimalist-photography"
                        aria-invalid={errors.slug ? true : undefined}
                        className="pl-8 bg-background focus-visible:ring-primary/20"
                        {...field} 
                      />
                    </div>
                    {errors.slug ? (
                      <FieldDescription className="text-destructive font-medium">{errors.slug.message}</FieldDescription>
                    ) : (
                      <FieldDescription>This forms the URL of your community. It cannot be changed later.</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Field data-invalid={errors.description ? "" : undefined}>
                    <FieldLabel htmlFor="description" className="font-semibold">Description</FieldLabel>
                    <Textarea 
                      id="description"
                      placeholder="What is this community about? Who is it for?"
                      aria-invalid={errors.description ? true : undefined}
                      className="resize-none min-h-[100px] bg-background focus-visible:ring-primary/20"
                      {...field} 
                    />
                    {errors.description && (
                      <FieldDescription className="text-destructive font-medium">{errors.description.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

            </FieldGroup>

            <div className="pt-6 border-t border-border/40 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="font-semibold px-6 gap-2">
                <PlusCircle className="size-4" />
                {isSubmitting ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
