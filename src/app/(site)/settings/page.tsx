/** @format */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, ImageIcon, Save, UserCircle } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  const displayName = useWatch({ control, name: "displayName" });
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

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

  const name = displayName || me?.displayName || "Your name";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Account
          </p>
          <h1 className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
            Settings
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Shape the public details people encounter when they find your work.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-14">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border border-border bg-muted">
              <AvatarImage src={avatarUrl || undefined} alt={name} className="object-cover" />
              <AvatarFallback className="font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {me ? `@${me.username}` : "Your public profile"}
              </p>
            </div>
          </div>

          <nav aria-label="Settings sections" className="mt-8 flex gap-1 overflow-x-auto border-y border-border py-3 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-y-0 lg:py-0">
            <a href="#profile" className="shrink-0 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:border-l-2 lg:border-primary lg:pl-4">
              Public profile
            </a>
            <a href="#appearance" className="shrink-0 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:border-l-2 lg:border-transparent lg:pl-4">
              Profile media
            </a>
          </nav>

          {me && (
            <Button variant="ghost" size="sm" className="mt-6" asChild>
              <Link href={`/u/${me.username}`}>
                View public profile
                <ExternalLink data-icon="inline-end" />
              </Link>
            </Button>
          )}
        </aside>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0">
          <section id="profile" aria-labelledby="profile-heading" className="scroll-mt-8">
            <div className="max-w-2xl">
              <div className="flex items-start gap-3">
                <UserCircle className="mt-1 size-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <h2 id="profile-heading" className="font-heading text-2xl font-medium tracking-[-0.03em] text-foreground">
                    Public profile
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The essentials that introduce you across Soma.
                  </p>
                </div>
              </div>

              <FieldGroup className="mt-8 max-w-xl">
                <Controller
                  control={control}
                  name="displayName"
                  render={({ field }) => (
                    <Field data-invalid={errors.displayName ? true : undefined}>
                      <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                      <Input id="displayName" autoComplete="name" aria-invalid={errors.displayName ? true : undefined} {...field} />
                      <FieldDescription>Use a name or pseudonym people will recognise.</FieldDescription>
                      <FieldError errors={errors.displayName ? [errors.displayName] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <Field data-disabled>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input id="username" readOnly disabled className="bg-muted" {...field} />
                      <FieldDescription>Your handle is managed separately and cannot be changed yet.</FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <Field data-invalid={errors.bio ? true : undefined}>
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <Textarea id="bio" className="min-h-28 resize-none" aria-invalid={errors.bio ? true : undefined} {...field} />
                      <FieldDescription>Up to 160 characters.</FieldDescription>
                      <FieldError errors={errors.bio ? [errors.bio] : undefined} />
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </section>

          <Separator className="my-12 sm:my-16" />

          <section id="appearance" aria-labelledby="appearance-heading" className="scroll-mt-8">
            <div className="max-w-2xl">
              <div className="flex items-start gap-3">
                <ImageIcon className="mt-1 size-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <h2 id="appearance-heading" className="font-heading text-2xl font-medium tracking-[-0.03em] text-foreground">
                    Profile media
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Add image links to make your page feel unmistakably yours.
                  </p>
                </div>
              </div>

              <FieldGroup className="mt-8 max-w-xl">
                <Controller
                  control={control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <Field data-invalid={errors.avatarUrl ? true : undefined}>
                      <FieldLabel htmlFor="avatarUrl">Avatar image URL</FieldLabel>
                      <Input id="avatarUrl" type="url" placeholder="https://…" aria-invalid={errors.avatarUrl ? true : undefined} {...field} />
                      <FieldDescription>A square image works best.</FieldDescription>
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
                      <Input id="coverUrl" type="url" placeholder="https://…" aria-invalid={errors.coverUrl ? true : undefined} {...field} />
                      <FieldDescription>Choose a wide image that still reads well when cropped.</FieldDescription>
                      <FieldError errors={errors.coverUrl ? [errors.coverUrl] : undefined} />
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </section>

          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
            <FieldError errors={errors.root ? [errors.root] : undefined} />
            <Button type="submit" disabled={isSubmitting || meLoading || !me} className="sm:ml-auto">
              <Save data-icon="inline-start" />
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
