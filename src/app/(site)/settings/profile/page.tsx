/** @format */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ExternalLink, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { useUpdateMyProfile } from "@/modules/user/api/useUpdateMyProfile";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  bio: z.string().max(160, "Bio is too long"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { me, isLoading: meLoading } = useGetMe();
  const { updateProfile } = useUpdateMyProfile();
  const { control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", username: "", bio: "" },
  });

  useEffect(() => {
    if (!me) return;
    reset({ displayName: me.displayName ?? "", username: me.username, bio: me.bio ?? "" });
  }, [me, reset]);

  const onSubmit = async (values: ProfileValues) => {
    try {
      await updateProfile({ displayName: values.displayName, bio: values.bio || undefined });
      toast.success("Your public profile has been updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not update your profile.";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-4" aria-hidden="true" />Settings</Link>
      <header className="mt-8 border-b border-border pb-8 sm:mt-10 sm:pb-10">
        <div className="flex items-start gap-3"><UserRound className="mt-1 size-5 text-muted-foreground" aria-hidden="true" /><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Public profile</p><h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">Edit profile</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">These details appear wherever people encounter your work.</p></div></div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl py-10 sm:py-12">
        <FieldGroup>
          <Controller control={control} name="displayName" render={({ field }) => <Field data-invalid={errors.displayName ? true : undefined}><FieldLabel htmlFor="displayName">Display name</FieldLabel><Input id="displayName" autoComplete="name" aria-invalid={errors.displayName ? true : undefined} {...field} /><FieldDescription>Use a name or pseudonym people will recognise.</FieldDescription><FieldError errors={errors.displayName ? [errors.displayName] : undefined} /></Field>} />
          <Controller control={control} name="username" render={({ field }) => <Field data-disabled><FieldLabel htmlFor="username">Username</FieldLabel><Input id="username" disabled readOnly className="bg-muted" {...field} /><FieldDescription>Your handle is managed separately and cannot be changed yet.</FieldDescription></Field>} />
          <Controller control={control} name="bio" render={({ field }) => <Field data-invalid={errors.bio ? true : undefined}><FieldLabel htmlFor="bio">Bio</FieldLabel><Textarea id="bio" className="min-h-28 resize-none" aria-invalid={errors.bio ? true : undefined} {...field} /><FieldDescription>Up to 160 characters.</FieldDescription><FieldError errors={errors.bio ? [errors.bio] : undefined} /></Field>} />
          <FieldError errors={errors.root ? [errors.root] : undefined} />
        </FieldGroup>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {me && <Button type="button" variant="ghost" asChild><Link href={`/u/${me.username}`}>View profile<ExternalLink data-icon="inline-end" /></Link></Button>}
          <Button type="submit" disabled={isSubmitting || meLoading || !me} className="sm:ml-auto"><Save data-icon="inline-start" />{isSubmitting ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>
    </main>
  );
}
