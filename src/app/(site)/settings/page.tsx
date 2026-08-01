/** @format */

"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserCircle } from "lucide-react";
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
import { useGetMe } from "@/modules/user/api/useGetMe";
import { useUpdateMyProfile } from "@/modules/user/api/useUpdateMyProfile";

const optionalUrl = z.string().url("Use a valid image URL").or(z.literal(""));

const settingsSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  bio: z.string().max(160, "Bio is too long"),
  avatarUrl: optionalUrl,
  coverUrl: optionalUrl,
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { me, isLoading: meLoading } = useGetMe();
  const { updateProfile } = useUpdateMyProfile();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "",
      username: "",
      bio: "",
      avatarUrl: "",
      coverUrl: "",
    },
  });

  useEffect(() => {
    if (!me) return;

    reset({
      displayName: me.displayName ?? "",
      username: me.username,
      bio: me.bio ?? "",
      avatarUrl: me.avatarUrl ?? "",
      coverUrl: me.coverUrl ?? "",
    });
  }, [me, reset]);

  const onSubmit = async (values: SettingsValues) => {
    try {
      await updateProfile({
        displayName: values.displayName,
        bio: values.bio || undefined,
        avatarUrl: values.avatarUrl || undefined,
        coverUrl: values.coverUrl || undefined,
      });
      toast.success("Your public profile has been updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not update your profile.";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-medium tracking-[-0.035em]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the public details that travel with your work.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCircle data-icon="inline-start" />
              Public profile
            </CardTitle>
            <CardDescription>
              Changes appear wherever people encounter your work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  control={control}
                  name="displayName"
                  render={({ field }) => (
                    <Field data-invalid={errors.displayName ? true : undefined}>
                      <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                      <Input
                        id="displayName"
                        autoComplete="name"
                        aria-invalid={errors.displayName ? true : undefined}
                        {...field}
                      />
                      <FieldDescription>
                        Use a name or pseudonym people will recognise.
                      </FieldDescription>
                      <FieldError errors={errors.displayName ? [errors.displayName] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <Field data-invalid={errors.username ? true : undefined}>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        id="username"
                        readOnly
                        aria-invalid={errors.username ? true : undefined}
                        className="bg-muted"
                        {...field}
                      />
                      <FieldDescription>
                        Your handle is managed separately and cannot be changed yet.
                      </FieldDescription>
                      <FieldError errors={errors.username ? [errors.username] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <Field data-invalid={errors.bio ? true : undefined}>
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <Textarea
                        id="bio"
                        className="min-h-28 resize-none"
                        aria-invalid={errors.bio ? true : undefined}
                        {...field}
                      />
                      <FieldDescription>Up to 160 characters.</FieldDescription>
                      <FieldError errors={errors.bio ? [errors.bio] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <Field data-invalid={errors.avatarUrl ? true : undefined}>
                      <FieldLabel htmlFor="avatarUrl">Avatar image URL</FieldLabel>
                      <Input
                        id="avatarUrl"
                        type="url"
                        placeholder="https://…"
                        aria-invalid={errors.avatarUrl ? true : undefined}
                        {...field}
                      />
                      <FieldError errors={errors.avatarUrl ? [errors.avatarUrl] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="coverUrl"
                  render={({ field }) => (
                    <Field data-invalid={errors.coverUrl ? true : undefined}>
                      <FieldLabel htmlFor="coverUrl">Cover image URL</FieldLabel>
                      <Input
                        id="coverUrl"
                        type="url"
                        placeholder="https://…"
                        aria-invalid={errors.coverUrl ? true : undefined}
                        {...field}
                      />
                      <FieldError errors={errors.coverUrl ? [errors.coverUrl] : undefined} />
                    </Field>
                  )}
                />
                <FieldError errors={errors.root ? [errors.root] : undefined} />
              </FieldGroup>
              <CardFooter className="mt-6 justify-end border-t">
                <Button type="submit" disabled={isSubmitting || meLoading || !me}>
                  <Save data-icon="inline-start" />
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
