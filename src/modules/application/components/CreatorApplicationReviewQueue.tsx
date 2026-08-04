"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { Check, ClipboardCheck, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { graphql } from "@/gql";
import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { cn } from "@/lib/utils";

const GET_REVIEW_QUEUE = graphql(`
  query GetSomaCreatorReviewQueue($somaId: String!) {
    somaCreatorReviewQueue(somaId: $somaId) {
      id
      applicantId
      disciplines
      portfolioUrls
      processSamples
      statement
      status
      createdAt
      moderationConsent
    }
  }
`);

const GET_REVIEW_APPLICANT = graphql(`
  query GetCreatorReviewApplicant($id: String!) {
    getUserById(id: $id) {
      __typename
      ... on UserResponseDto {
        id
        displayName
        username
        avatarUrl
        bio
      }
    }
  }
`);

const REVIEW_CREATOR_APPLICATION = graphql(`
  mutation ReviewCreatorApplication($input: ReviewSomaCreatorApplicationInput!) {
    reviewSomaCreatorApplication(input: $input) {
      __typename
      ... on SomaCreatorApplication {
        id
        status
        reviewedAt
        reviewerNote
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

type ReviewValues = { reviewerNote: string };
type Decision = "APPROVED" | "NEEDS_INFO" | "DECLINED";

const decisionCopy: Record<Decision, string> = {
  APPROVED: "Approve creator",
  NEEDS_INFO: "Request information",
  DECLINED: "Decline application",
};

export function CreatorApplicationReviewQueue() {
  const { me, isLoading: meLoading } = useGetMe();
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  const [somaId, setSomaId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const { data, loading, error } = useQuery(GET_REVIEW_QUEUE, {
    variables: { somaId },
    skip: !somaId || !me,
    fetchPolicy: "network-only",
  });
  const applications = (data?.somaCreatorReviewQueue ?? []).filter(
    (application) => application.status === "SUBMITTED" || application.status === "IN_REVIEW",
  );
  const selectedApplication = applications.find((application) => application.id === selectedApplicationId) ?? null;
  const { data: applicantData, loading: applicantLoading } = useQuery(GET_REVIEW_APPLICANT, {
    variables: { id: selectedApplication?.applicantId ?? "" },
    skip: !selectedApplication,
  });
  const applicant = applicantData?.getUserById.__typename === "UserResponseDto"
    ? applicantData.getUserById
    : null;
  const [reviewApplication, { loading: isReviewing }] = useMutation(REVIEW_CREATOR_APPLICATION);
  const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<ReviewValues>({ defaultValues: { reviewerNote: "" } });

  const selectSoma = (nextSomaId: string) => {
    setSomaId(nextSomaId);
    setSelectedApplicationId(null);
    reset({ reviewerNote: "" });
  };

  const selectApplication = (id: string) => {
    setSelectedApplicationId(id);
    reset({ reviewerNote: "" });
  };

  const makeDecision = (decision: Decision) =>
    handleSubmit(async ({ reviewerNote }) => {
      if (!selectedApplication) return;
      if (decision !== "APPROVED" && !reviewerNote.trim()) {
        setError("root", { message: "Leave a clear note so the applicant understands this decision." });
        return;
      }

      try {
        const { data: reviewData } = await reviewApplication({
          variables: {
            input: {
              applicationId: selectedApplication.id,
              decision,
              reviewerNote: reviewerNote.trim() || undefined,
            },
          },
        });
        const result = reviewData?.reviewSomaCreatorApplication;

        if (!result || result.__typename !== "SomaCreatorApplication") {
          const message = result?.message ?? "We could not record this decision.";
          setError("root", { message });
          toast.error(message);
          return;
        }

        toast.success(`${decisionCopy[decision]} recorded.`);
        setSelectedApplicationId(null);
        reset({ reviewerNote: "" });
      } catch (reviewError) {
        const message = reviewError instanceof Error ? reviewError.message : "We could not record this decision.";
        setError("root", { message });
        toast.error(message);
      }
    });

  if (meLoading || somasLoading) return <ReviewSkeleton />;

  if (!me) {
    return <ReviewState title="Sign in to review applications" description="Only authorised Soma reviewers can access this workspace." />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Creator review</p>
          <h1 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Review with care.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Consider the work, process, and fit for each Soma—not just a single signal.</p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={somaId} onValueChange={selectSoma}>
            <SelectTrigger aria-label="Choose a Soma review queue"><SelectValue placeholder="Choose a Soma" /></SelectTrigger>
            <SelectContent><SelectGroup>{somas?.map((soma) => <SelectItem key={soma.id} value={soma.id}>{soma.name}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </div>
      </div>

      {!somaId ? (
        <ReviewState title="Choose a Soma" description="Select a community to open its creator application queue." />
      ) : error ? (
        <ReviewState title="This queue is unavailable" description="You may not have review access for this Soma, or the queue could not be loaded." />
      ) : loading ? (
        <ReviewSkeleton />
      ) : applications.length === 0 ? (
        <ReviewState title="No applications awaiting review" description="When a creator applies to this Soma, their application will appear here." />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="border-y border-border lg:border-y-0 lg:border-r lg:pr-6">
            <div className="flex items-center justify-between py-3"><p className="text-sm font-medium">Queue</p><Badge variant="secondary">{applications.length}</Badge></div>
            <div className="border-t border-border">
              {applications.map((application) => {
                const isSelected = application.id === selectedApplicationId;
                return <Button key={application.id} type="button" variant={isSelected ? "secondary" : "ghost"} onClick={() => selectApplication(application.id)} className={cn("h-auto w-full justify-start rounded-none px-3 py-4 text-left", isSelected && "text-secondary-foreground")}><span className="flex min-w-0 flex-col items-start gap-1"><span className="truncate text-sm font-medium">Applicant {application.applicantId.slice(0, 8)}</span><span className="text-xs text-muted-foreground">Submitted {format(new Date(application.createdAt), "d MMM")}</span></span></Button>;
              })}
            </div>
          </aside>
          {selectedApplication ? (
            <ApplicationDetail application={selectedApplication} applicant={applicant} applicantLoading={applicantLoading} control={control} errors={errors} isReviewing={isReviewing} onDecision={makeDecision} />
          ) : (
            <ReviewState title="Select an application" description="Open an application from the queue to read the creator’s work and record a decision." compact />
          )}
        </div>
      )}
    </div>
  );
}

function ApplicationDetail({ application, applicant, applicantLoading, control, errors, isReviewing, onDecision }: {
  application: { id: string; applicantId: string; disciplines: string[]; portfolioUrls: string[]; processSamples: string[]; statement: string; moderationConsent: boolean; createdAt: string };
  applicant: { displayName: string | null; username: string; avatarUrl: string | null; bio: string | null } | null;
  applicantLoading: boolean;
  control: ReturnType<typeof useForm<ReviewValues>>["control"];
  errors: ReturnType<typeof useForm<ReviewValues>>["formState"]["errors"];
  isReviewing: boolean;
  onDecision: (decision: Decision) => () => void;
}) {
  const name = applicant?.displayName || applicant?.username || `Applicant ${application.applicantId.slice(0, 8)}`;
  const initials = name.slice(0, 2).toUpperCase();

  return <article className="min-w-0">
    <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="lg"><AvatarImage src={applicant?.avatarUrl || undefined} alt={name} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
        <div className="min-w-0"><p className="font-heading text-2xl font-medium tracking-[-0.03em]">{applicantLoading ? "Loading applicant…" : name}</p>{applicant && <Link href={`/u/${applicant.username}`} className="text-sm text-muted-foreground hover:text-primary">@{applicant.username}</Link>}</div>
      </div>
      <Badge variant="secondary">Submitted {format(new Date(application.createdAt), "d MMM yyyy")}</Badge>
    </div>

    {applicant?.bio && <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">{applicant.bio}</p>}
    <div className="mt-8 grid gap-8 border-y border-border py-7 sm:grid-cols-2">
      <DetailList title="Disciplines" entries={application.disciplines} />
      <DetailList title="Portfolio" entries={application.portfolioUrls} links />
      <div className="sm:col-span-2"><p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Artist statement</p><p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-foreground">{application.statement}</p></div>
      <div className="sm:col-span-2"><DetailList title="Process samples" entries={application.processSamples} links /></div>
    </div>

    <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
      <FieldGroup className="gap-5">
        <Controller control={control} name="reviewerNote" render={({ field }) => <Field data-invalid={errors.reviewerNote ? true : undefined}><FieldLabel htmlFor="reviewer-note">Reviewer note</FieldLabel><Textarea id="reviewer-note" className="min-h-28 resize-y" placeholder="Required when requesting information or declining. Keep the next step clear and kind." aria-invalid={errors.reviewerNote ? true : undefined} {...field} /><FieldDescription>This note is shared with the applicant.</FieldDescription><FieldError errors={errors.reviewerNote ? [errors.reviewerNote] : undefined} /></Field>} />
        <FieldError errors={errors.root ? [errors.root] : undefined} />
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:flex-wrap">
          <Button type="button" disabled={isReviewing} onClick={onDecision("APPROVED")}><Check data-icon="inline-start" />Approve creator</Button>
          <Button type="button" variant="outline" disabled={isReviewing} onClick={onDecision("NEEDS_INFO")}><HelpCircle data-icon="inline-start" />Request information</Button>
          <Button type="button" variant="destructive" disabled={isReviewing} onClick={onDecision("DECLINED")}><X data-icon="inline-start" />Decline</Button>
        </div>
      </FieldGroup>
    </form>
  </article>;
}

function DetailList({ title, entries, links = false }: { title: string; entries: string[]; links?: boolean }) {
  return <div><p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">{title}</p><ul className="mt-3 flex flex-col gap-2 text-sm leading-6">{entries.map((entry) => <li key={entry}>{links ? <a href={entry} target="_blank" rel="noreferrer" className="break-all text-foreground underline decoration-border underline-offset-4 hover:text-primary">{entry}</a> : <span className="text-foreground">{entry}</span>}</li>)}</ul></div>;
}

function ReviewState({ title, description, compact = false }: { title: string; description: string; compact?: boolean }) {
  return <section className={cn("flex flex-col items-center border-y border-border text-center", compact ? "py-16" : "mt-8 py-20")}><ClipboardCheck className="size-6 text-primary" /><h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.03em]">{title}</h2><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p></section>;
}

function ReviewSkeleton() {
  return <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]"><div className="flex flex-col gap-3"><Skeleton className="h-6 w-24" /><Skeleton className="h-18 w-full" /><Skeleton className="h-18 w-full" /></div><div className="flex flex-col gap-5"><Skeleton className="h-12 w-56" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-4/5" /><Skeleton className="h-32 w-full" /></div></div>;
}
