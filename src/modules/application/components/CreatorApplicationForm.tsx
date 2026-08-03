"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, FileText, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { graphql } from "@/gql";
import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { cn } from "@/lib/utils";

const steps = ["Your Soma", "Your work", "Your statement"] as const;

const SUBMIT_CREATOR_APPLICATION = graphql(`
  mutation SubmitCreatorApplication($input: SubmitSomaCreatorApplicationInput!) {
    submitSomaCreatorApplication(input: $input) {
      __typename
      ... on SomaCreatorApplication {
        id
        status
      }
      ... on InvalidInputError {
        message
      }
      ... on NotFoundError {
        message
      }
      ... on UnauthorizedError {
        message
      }
    }
  }
`);

const applicationSchema = z.object({
  somaId: z.string().min(1, "Choose the Soma you would like to contribute to."),
  disciplines: z.string().min(2, "Name at least one discipline."),
  portfolioUrls: z.string().min(1, "Share at least one portfolio link."),
  statement: z.string().min(80, "Tell us a little more about your practice (at least 80 characters).").max(2_000, "Keep your statement under 2,000 characters."),
  processSamples: z.string().min(1, "Share at least one process sample or link."),
  moderationConsent: z.boolean().refine((value) => value, {
    message: "Please confirm that you understand the review process.",
  }),
});

type ApplicationValues = z.infer<typeof applicationSchema>;
type Step = 1 | 2 | 3;

function splitEntries(value: string) {
  return value.split(/[\n,]+/).map((entry) => entry.trim()).filter(Boolean);
}

export function CreatorApplicationForm() {
  const router = useRouter();
  const { me, isLoading: meLoading } = useGetMe();
  const { data: somas, isLoading: somasLoading, error: somasError } = useGetSomas();
  const [step, setStep] = useState<Step>(1);
  const [submitApplication, { loading: isSubmitting }] = useMutation(SUBMIT_CREATOR_APPLICATION);
  const methods = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    mode: "onBlur",
    defaultValues: {
      somaId: "",
      disciplines: "",
      portfolioUrls: "",
      statement: "",
      processSamples: "",
      moderationConsent: false,
    },
  });
  const {
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors },
  } = methods;

  const continueTo = async (nextStep: Step) => {
    const fields: Array<keyof ApplicationValues> =
      step === 1 ? ["somaId"] : ["disciplines", "portfolioUrls", "processSamples"];
    const isValid = await trigger(fields);
    if (!isValid) return;
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: ApplicationValues) => {
    try {
      const { data } = await submitApplication({
        variables: {
          input: {
            somaId: values.somaId,
            disciplines: splitEntries(values.disciplines),
            portfolioUrls: splitEntries(values.portfolioUrls),
            statement: values.statement.trim(),
            processSamples: splitEntries(values.processSamples),
            moderationConsent: values.moderationConsent,
          },
        },
      });
      const result = data?.submitSomaCreatorApplication;

      if (!result || result.__typename !== "SomaCreatorApplication") {
        const message = result?.message ?? "We could not submit your application.";
        setError("root", { message });
        toast.error(message);
        return;
      }

      toast.success("Your application has been submitted.");
      router.push("/apply/status");
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not submit your application.";
      setError("root", { message });
      toast.error(message);
    }
  };

  if (!meLoading && !me) {
    return <SignInToApply />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <p className="font-heading text-xl font-medium tracking-[-0.03em]">Creator application</p>
          <p className="text-xs text-muted-foreground">A considered review, at your pace</p>
        </div>

        {step === 1 && (
          <FieldSet>
            <FieldLegend>Your Soma</FieldLegend>
            <FieldDescription>Start with the community where you would like to share your work as a creator.</FieldDescription>
            <FieldGroup className="mt-6">
              <Controller
                control={control}
                name="somaId"
                render={({ field }) => (
                  <Field data-invalid={errors.somaId ? true : undefined}>
                    <FieldLabel htmlFor="soma">Soma</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={somasLoading}>
                      <SelectTrigger id="soma" aria-invalid={errors.somaId ? true : undefined}>
                        <SelectValue placeholder={somasLoading ? "Loading Somas…" : "Choose a Soma"} />
                      </SelectTrigger>
                      <SelectContent><SelectGroup>{somas?.map((soma) => <SelectItem key={soma.id} value={soma.id}>{soma.name}</SelectItem>)}</SelectGroup></SelectContent>
                    </Select>
                    <FieldError errors={errors.somaId ? [errors.somaId] : undefined} />
                  </Field>
                )}
              />
              {somasError && <FieldError>We couldn’t load the available Somas. Please refresh and try again.</FieldError>}
            </FieldGroup>
          </FieldSet>
        )}

        {step === 2 && (
          <FieldSet>
            <FieldLegend>Your work</FieldLegend>
            <FieldDescription>Show us the contours of your practice. Clear links and a little process are more useful than a polished pitch.</FieldDescription>
            <FieldGroup className="mt-6 gap-7">
              <Controller control={control} name="disciplines" render={({ field }) => <Field data-invalid={errors.disciplines ? true : undefined}><FieldLabel htmlFor="disciplines">Disciplines</FieldLabel><Input id="disciplines" placeholder="Photography, illustration, sound…" aria-invalid={errors.disciplines ? true : undefined} {...field} /><FieldDescription>Separate disciplines with commas.</FieldDescription><FieldError errors={errors.disciplines ? [errors.disciplines] : undefined} /></Field>} />
              <Controller control={control} name="portfolioUrls" render={({ field }) => <Field data-invalid={errors.portfolioUrls ? true : undefined}><FieldLabel htmlFor="portfolio">Portfolio links</FieldLabel><Textarea id="portfolio" className="min-h-28 resize-y" placeholder={"https://your-portfolio.com\nhttps://instagram.com/your-work"} aria-invalid={errors.portfolioUrls ? true : undefined} {...field} /><FieldDescription>One link per line. A portfolio, body of work, or relevant profile is welcome.</FieldDescription><FieldError errors={errors.portfolioUrls ? [errors.portfolioUrls] : undefined} /></Field>} />
              <Controller control={control} name="processSamples" render={({ field }) => <Field data-invalid={errors.processSamples ? true : undefined}><FieldLabel htmlFor="process">Process samples</FieldLabel><Textarea id="process" className="min-h-28 resize-y" placeholder="Links to sketches, work-in-progress notes, source files, or a short process write-up." aria-invalid={errors.processSamples ? true : undefined} {...field} /><FieldDescription>One link or note per line. This helps us understand how the work came together.</FieldDescription><FieldError errors={errors.processSamples ? [errors.processSamples] : undefined} /></Field>} />
            </FieldGroup>
          </FieldSet>
        )}

        {step === 3 && (
          <FieldSet>
            <FieldLegend>In your own words</FieldLegend>
            <FieldDescription>Tell us what guides your practice and what you hope to bring to this Soma.</FieldDescription>
            <FieldGroup className="mt-6 gap-7">
              <Controller control={control} name="statement" render={({ field }) => <Field data-invalid={errors.statement ? true : undefined}><FieldLabel htmlFor="statement">Artist statement</FieldLabel><Textarea id="statement" className="min-h-64 resize-y text-base leading-7" placeholder="Tell us what you make, what guides your practice, and what you hope to bring to this Soma." aria-invalid={errors.statement ? true : undefined} {...field} /><FieldDescription>At least 80 characters. Write in your own voice.</FieldDescription><FieldError errors={errors.statement ? [errors.statement] : undefined} /></Field>} />
              <Controller control={control} name="moderationConsent" render={({ field }) => <Field data-invalid={errors.moderationConsent ? true : undefined} orientation="horizontal"><Checkbox id="moderation-consent" checked={field.value} onCheckedChange={field.onChange} aria-invalid={errors.moderationConsent ? true : undefined} /><FieldContent><FieldLabel htmlFor="moderation-consent">I understand this application is reviewed against Soma’s creator standards.</FieldLabel><FieldDescription>I confirm that the work and process links I’ve shared are mine or clearly attributed.</FieldDescription><FieldError errors={errors.moderationConsent ? [errors.moderationConsent] : undefined} /></FieldContent></Field>} />
            </FieldGroup>
          </FieldSet>
        )}

        <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3" aria-label={`Step ${step} of 3`}>
            <span className="text-xs text-muted-foreground">Step {step} of 3</span>
            <span className="flex gap-1.5" aria-hidden="true">{steps.map((item, index) => <span key={item} className={cn("h-1 w-6 rounded-full", index < step ? "bg-primary" : "bg-border")} />)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {step > 1 && <Button type="button" variant="ghost" onClick={() => setStep((step - 1) as Step)}><ArrowLeft data-icon="inline-start" />Back</Button>}
            {step < 3 ? <Button type="button" onClick={() => void continueTo((step + 1) as Step)} disabled={Boolean(somasError) && step === 1}>Continue<ArrowRight data-icon="inline-end" /></Button> : <Button type="submit" disabled={isSubmitting || somasLoading || Boolean(somasError)}>{isSubmitting && <LoaderCircle data-icon="inline-start" className="animate-spin" />}{isSubmitting ? "Submitting…" : "Submit application"}</Button>}
          </div>
        </div>
        <FieldError errors={errors.root ? [errors.root] : undefined} className="mt-4" />
      </form>
    </FormProvider>
  );
}

function SignInToApply() {
  return <section className="border-y border-border py-14 text-center"><FileText className="mx-auto size-6 text-primary" /><h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.03em]">Sign in to apply</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Creatorship applications are tied to your Soma account, so we can keep the review thoughtful and personal.</p><Button asChild className="mt-6"><Link href="/login">Sign in to Soma<ArrowRight data-icon="inline-end" /></Link></Button></section>;
}
