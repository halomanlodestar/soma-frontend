import { format } from "date-fns";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReviewDecisionForm } from "@/modules/application/components/ReviewDecisionForm";
import type {
  ReviewApplicant,
  ReviewApplication,
} from "@/modules/application/types/creator-review";

export function ReviewApplicationDetail({
  application,
  applicant,
  applicantLoading,
  onComplete,
}: {
  application: ReviewApplication;
  applicant: ReviewApplicant | null;
  applicantLoading: boolean;
  onComplete: () => void;
}) {
  const name =
    applicant?.displayName ||
    applicant?.username ||
    `Applicant ${application.applicantId.slice(0, 8)}`;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <article className="min-w-0">
      <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={applicant?.avatarUrl || undefined} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-medium tracking-[-0.03em]">
              {applicantLoading ? "Loading applicant…" : name}
            </p>
            {applicant && (
              <Link
                href={`/u/${applicant.username}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                @{applicant.username}
              </Link>
            )}
          </div>
        </div>
        <Badge variant="secondary">
          Submitted {format(new Date(application.createdAt), "d MMM yyyy")}
        </Badge>
      </div>

      {applicant?.bio && (
        <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
          {applicant.bio}
        </p>
      )}
      <div className="mt-8 grid gap-8 border-y border-border py-7 sm:grid-cols-2">
        <DetailList title="Disciplines" entries={application.disciplines} />
        <DetailList title="Portfolio" entries={application.portfolioUrls} links />
        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
            Artist statement
          </p>
          <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-foreground">
            {application.statement}
          </p>
        </div>
        <div className="sm:col-span-2">
          <DetailList
            title="Process samples"
            entries={application.processSamples}
            links
          />
        </div>
      </div>

      <ReviewDecisionForm
        key={application.id}
        applicationId={application.id}
        onComplete={onComplete}
      />
    </article>
  );
}

function DetailList({
  title,
  entries,
  links = false,
}: {
  title: string;
  entries: string[];
  links?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
        {title}
      </p>
      <ul className="mt-3 flex flex-col gap-2 text-sm leading-6">
        {entries.map((entry) => (
          <li key={entry}>
            {links ? (
              <a
                href={entry}
                target="_blank"
                rel="noreferrer"
                className="break-all text-foreground underline decoration-border underline-offset-4 hover:text-primary"
              >
                {entry}
              </a>
            ) : (
              <span className="text-foreground">{entry}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
