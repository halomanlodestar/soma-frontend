/** @format */

"use client";

import { useMutation } from "@apollo/client/react";
import { Controller, useForm } from "react-hook-form";
import { Check, HelpCircle, X } from "lucide-react";
import { toast } from "sonner";

import { ReviewCreatorApplicationDocument } from "@/modules/application/api/creator-review-documents";
import type {
  ReviewDecision,
  ReviewValues,
} from "@/modules/application/types/creator-review";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const decisionCopy: Record<ReviewDecision, string> = {
  APPROVED: "Approve creator",
  NEEDS_INFO: "Request information",
  DECLINED: "Decline application",
};

export function ReviewDecisionForm({
  applicationId,
  onComplete,
}: {
  applicationId: string;
  onComplete: () => void;
}) {
  const [reviewApplication, { loading: isReviewing }] = useMutation(
    ReviewCreatorApplicationDocument,
  );
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ReviewValues>({ defaultValues: { reviewerNote: "" } });

  const makeDecision = (decision: ReviewDecision) =>
    handleSubmit(async ({ reviewerNote }) => {
      if (decision !== "APPROVED" && !reviewerNote.trim()) {
        setError("root", {
          message:
            "Leave a clear note so the applicant understands this decision.",
        });
        return;
      }

      try {
        const { data } = await reviewApplication({
          variables: {
            input: {
              applicationId,
              decision,
              reviewerNote: reviewerNote.trim() || undefined,
            },
          },
        });
        const result = data?.reviewSomaCreatorApplication;

        if (!result || result.__typename !== "SomaCreatorApplication") {
          const message =
            result?.message ?? "We could not record this decision.";
          setError("root", { message });
          toast.error(message);
          return;
        }

        toast.success(`${decisionCopy[decision]} recorded.`);
        onComplete();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "We could not record this decision.";
        setError("root", { message });
        toast.error(message);
      }
    });

  return (
    <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
      <FieldGroup className="gap-5">
        <Controller
          control={control}
          name="reviewerNote"
          render={({ field }) => (
            <Field data-invalid={errors.reviewerNote ? true : undefined}>
              <FieldLabel htmlFor="reviewer-note">Reviewer note</FieldLabel>
              <Textarea
                id="reviewer-note"
                className="min-h-28 resize-y"
                placeholder="Required when requesting information or declining. Keep the next step clear and kind."
                aria-invalid={errors.reviewerNote ? true : undefined}
                {...field}
              />
              <FieldDescription>
                This note is shared with the applicant.
              </FieldDescription>
              <FieldError
                errors={errors.reviewerNote ? [errors.reviewerNote] : undefined}
              />
            </Field>
          )}
        />
        <FieldError errors={errors.root ? [errors.root] : undefined} />
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            disabled={isReviewing}
            onClick={makeDecision("APPROVED")}
          >
            <Check data-icon="inline-start" />
            Approve creator
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isReviewing}
            onClick={makeDecision("NEEDS_INFO")}
          >
            <HelpCircle data-icon="inline-start" />
            Request information
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isReviewing}
            onClick={makeDecision("DECLINED")}
          >
            <X data-icon="inline-start" />
            Decline
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
