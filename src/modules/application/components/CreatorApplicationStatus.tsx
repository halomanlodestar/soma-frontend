"use client";

import { useQuery } from "@apollo/client/react";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { graphql } from "@/gql";
import { useGetMe } from "@/modules/user/api/useGetMe";

const GET_APPLICATIONS_WITH_SOMAS = graphql(`
  query GetMyCreatorApplications {
    mySomaCreatorApplications {
      id
      somaId
      disciplines
      portfolioUrls
      statement
      processSamples
      status
      createdAt
      updatedAt
      reviewedAt
      reviewerNote
    }
    getAllSomas {
      id
      name
      slug
    }
  }
`);

const statusCopy = {
  SUBMITTED: { label: "Submitted", description: "Your application is safely in the review queue." },
  IN_REVIEW: { label: "In review", description: "A Soma reviewer is considering your application." },
  NEEDS_INFO: { label: "Needs information", description: "There’s a note from the reviewer with what to add next." },
  APPROVED: { label: "Accepted", description: "You’ve been welcomed as a creator in this Soma." },
  DECLINED: { label: "Not accepted", description: "This application was not accepted at this time." },
  WITHDRAWN: { label: "Withdrawn", description: "This application is no longer active." },
} as const;

export function CreatorApplicationStatus() {
  const { me, isLoading: meLoading } = useGetMe();
  const { data, loading, error } = useQuery(GET_APPLICATIONS_WITH_SOMAS, {
    skip: !me,
    fetchPolicy: "cache-and-network",
  });

  if (meLoading) {
    return <StatusSkeleton />;
  }

  if (!me) {
    return <SignInState />;
  }

  if (loading) {
    return <StatusSkeleton />;
  }

  if (error) {
    return (
      <section className="border-y border-border py-14 text-center">
        <h2 className="font-heading text-2xl font-medium">Couldn’t load your applications</h2>
        <p className="mt-2 text-sm text-muted-foreground">Please refresh and try again in a moment.</p>
      </section>
    );
  }

  const somaNames = new Map(data?.getAllSomas.map((soma) => [soma.id, soma]));
  const applications = data?.mySomaCreatorApplications ?? [];

  if (applications.length === 0) {
    return (
      <section className="flex flex-col items-center border-y border-border py-16 text-center">
        <FileText className="size-6 text-primary" />
        <h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.03em]">No applications yet</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          When you’re ready to share your practice with a Soma, your application will live here.
        </p>
        <Button asChild className="mt-6">
          <Link href="/apply">
            Apply for creatorship
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="border-y border-border">
      {applications.map((application) => {
        const status = statusCopy[application.status];
        const soma = somaNames.get(application.somaId);

        return (
          <article key={application.id} className="border-b border-border py-7 last:border-b-0 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{soma ? `s/${soma.slug}` : "Soma application"}</p>
                <h2 className="mt-1 font-heading text-2xl font-medium tracking-[-0.03em]">
                  {soma?.name ?? "Creator application"}
                </h2>
              </div>
              <Badge variant="secondary" className="w-fit">{status.label}</Badge>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{status.description}</p>
            <dl className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
              <div>
                <dt className="sr-only">Submitted</dt>
                <dd className="text-muted-foreground">Submitted {format(new Date(application.createdAt), "d MMMM yyyy")}</dd>
              </div>
              {application.reviewedAt && (
                <div>
                  <dt className="sr-only">Last reviewed</dt>
                  <dd className="text-muted-foreground">Reviewed {format(new Date(application.reviewedAt), "d MMMM yyyy")}</dd>
                </div>
              )}
            </dl>
            {application.reviewerNote && (
              <div className="mt-6 border-l-2 border-primary pl-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Note from the reviewer</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{application.reviewerNote}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function SignInState() {
  return (
    <section className="border-y border-border py-14 text-center">
      <FileText className="mx-auto size-6 text-primary" />
      <h2 className="mt-5 font-heading text-2xl font-medium">Sign in to view your applications</h2>
      <Button asChild className="mt-6">
        <Link href="/login">Sign in to Soma</Link>
      </Button>
    </section>
  );
}

function StatusSkeleton() {
  return (
    <div className="border-y border-border">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4 border-b border-border py-7 last:border-b-0">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-36" />
        </div>
      ))}
    </div>
  );
}
