"use client";

import { useGetMe } from "@/modules/user/api/useGetMe";
import { useGetSomas } from "@/modules/soma/api/useGetSomas";
import { useCreatorReviewQueue } from "@/modules/application/hooks/useCreatorReviewQueue";
import { ReviewApplicationDetail } from "@/modules/application/components/ReviewApplicationDetail";
import { ReviewQueueHeader } from "@/modules/application/components/ReviewQueueHeader";
import { ReviewQueueList } from "@/modules/application/components/ReviewQueueList";
import {
  ReviewWorkspaceSkeleton,
  ReviewWorkspaceState,
} from "@/modules/application/components/ReviewWorkspaceState";

export function CreatorApplicationReviewQueue() {
  const { me, isLoading: meLoading } = useGetMe();
  const { data: somas, isLoading: somasLoading } = useGetSomas();
  const isAdmin = me?.role === "ADMIN";
  const reviewQueue = useCreatorReviewQueue(isAdmin);

  if (meLoading || somasLoading) return <ReviewWorkspaceSkeleton />;

  if (!me) {
    return (
      <ReviewWorkspaceState
        title="Sign in to review applications"
        description="Only authorised Soma reviewers can access this workspace."
      />
    );
  }

  if (!isAdmin) {
    return (
      <ReviewWorkspaceState
        title="This workspace is restricted"
        description="Only Soma administrators can review creator applications."
      />
    );
  }

  return (
    <div>
      <ReviewQueueHeader
        somas={somas ?? []}
        somaId={reviewQueue.somaId}
        onSomaChange={reviewQueue.selectSoma}
      />

      {!reviewQueue.somaId ? (
        <ReviewWorkspaceState
          title="Choose a Soma"
          description="Select a community to open its creator application queue."
        />
      ) : reviewQueue.error ? (
        <ReviewWorkspaceState
          title="This queue is unavailable"
          description="You may not have review access for this Soma, or the queue could not be loaded."
        />
      ) : reviewQueue.loading ? (
        <ReviewWorkspaceSkeleton />
      ) : reviewQueue.applications.length === 0 ? (
        <ReviewWorkspaceState
          title="No applications awaiting review"
          description="When a creator applies to this Soma, their application will appear here."
        />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <ReviewQueueList
            applications={reviewQueue.applications}
            selectedApplicationId={reviewQueue.selectedApplication?.id ?? null}
            onSelect={reviewQueue.selectApplication}
          />
          {reviewQueue.selectedApplication ? (
            <ReviewApplicationDetail
              application={reviewQueue.selectedApplication}
              applicant={reviewQueue.applicant}
              applicantLoading={reviewQueue.applicantLoading}
              onComplete={() => reviewQueue.selectApplication(null)}
            />
          ) : (
            <ReviewWorkspaceState
              title="Select an application"
              description="Open an application from the queue to read the creator’s work and record a decision."
              compact
            />
          )}
        </div>
      )}
    </div>
  );
}
