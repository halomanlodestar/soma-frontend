/** @format */

"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSoma } from "@/modules/soma/api/useCreateSoma";

const createSomaSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Provide a little more context").max(200),
});

type CreateSomaValues = z.infer<typeof createSomaSchema>;

export default function CreateCommunityPage() {
  const router = useRouter();
  const { submitSoma } = useCreateSoma();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateSomaValues>({
    resolver: zodResolver(createSomaSchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const onSubmit = async (values: CreateSomaValues) => {
    try {
      const soma = await submitSoma(values);
      toast.success(`${soma.name} is ready.`);
      router.push(`/s/${soma.slug}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not create this Soma.";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-medium tracking-[-0.035em]">
            Start a Soma
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Propose a focused room where artists can gather around a shared practice.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe2 data-icon="inline-start" />
              Soma details
            </CardTitle>
            <CardDescription>
              Keep the invitation specific enough for the right people to recognise it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Field data-invalid={errors.name ? true : undefined}>
                      <FieldLabel htmlFor="name">Community name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="e.g. Minimalist Photography"
                        aria-invalid={errors.name ? true : undefined}
                        {...field}
                      />
                      <FieldDescription>The public name of this Soma.</FieldDescription>
                      <FieldError errors={errors.name ? [errors.name] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <Field data-invalid={errors.slug ? true : undefined}>
                      <FieldLabel htmlFor="slug">Soma URL</FieldLabel>
                      <Input
                        id="slug"
                        placeholder="minimalist-photography"
                        aria-invalid={errors.slug ? true : undefined}
                        {...field}
                      />
                      <FieldDescription>This becomes `s/{field.value || "your-soma"}`.</FieldDescription>
                      <FieldError errors={errors.slug ? [errors.slug] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Field data-invalid={errors.description ? true : undefined}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        id="description"
                        className="min-h-28 resize-none"
                        placeholder="What is this community about and who is it for?"
                        aria-invalid={errors.description ? true : undefined}
                        {...field}
                      />
                      <FieldError errors={errors.description ? [errors.description] : undefined} />
                    </Field>
                  )}
                />
                <FieldError errors={errors.root ? [errors.root] : undefined} />
              </FieldGroup>
              <CardFooter className="mt-6 justify-end border-t">
                <Button type="submit" disabled={isSubmitting}>
                  <PlusCircle data-icon="inline-start" />
                  {isSubmitting ? "Creating…" : "Create community"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
