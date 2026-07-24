/** @format */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const settingsSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  bio: z.string().max(160, "Bio is too long").optional(),
});

export default function SettingsPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "Kunal Rana",
      username: "kunal",
      bio: "Software Engineer & Designer.",
    },
  });

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    // Mock save delay
    await new Promise((r) => setTimeout(r, 800));
    console.log("Saved settings:", values);
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="w-full bg-card border-b border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your public profile and preferences.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <UserCircle className="size-5 text-primary" />
            Public Profile
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FieldGroup className="flex flex-col gap-6">
              <Controller
                control={control}
                name="displayName"
                render={({ field }) => (
                  <Field data-invalid={errors.displayName ? "" : undefined}>
                    <FieldLabel htmlFor="displayName" className="font-semibold">
                      Display Name
                    </FieldLabel>
                    <Input
                      id="displayName"
                      aria-invalid={errors.displayName ? true : undefined}
                      className="bg-background focus-visible:ring-primary/20"
                      {...field}
                    />
                    {errors.displayName ? (
                      <FieldDescription className="text-destructive font-medium">
                        {errors.displayName.message}
                      </FieldDescription>
                    ) : (
                      <FieldDescription>
                        This is your public display name. It can be your real
                        name or a pseudonym.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <Field data-invalid={errors.username ? "" : undefined}>
                    <FieldLabel htmlFor="username" className="font-semibold">
                      Username
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-muted-foreground sm:text-sm">
                          u/
                        </span>
                      </div>
                      <Input
                        id="username"
                        aria-invalid={errors.username ? true : undefined}
                        className="pl-8 bg-background focus-visible:ring-primary/20"
                        {...field}
                      />
                    </div>
                    {errors.username ? (
                      <FieldDescription className="text-destructive font-medium">
                        {errors.username.message}
                      </FieldDescription>
                    ) : (
                      <FieldDescription>
                        This is your unique handle on the platform.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="bio"
                render={({ field }) => (
                  <Field data-invalid={errors.bio ? "" : undefined}>
                    <FieldLabel htmlFor="bio" className="font-semibold">
                      Bio
                    </FieldLabel>
                    <Textarea
                      id="bio"
                      aria-invalid={errors.bio ? true : undefined}
                      className="resize-none min-h-25 bg-background focus-visible:ring-primary/20"
                      {...field}
                    />
                    {errors.bio ? (
                      <FieldDescription className="text-destructive font-medium">
                        {errors.bio.message}
                      </FieldDescription>
                    ) : (
                      <FieldDescription>
                        Brief description for your profile. URLs are hyperlinked
                        automatically.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="pt-6 border-t border-border/40 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-semibold px-6 gap-2"
              >
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
