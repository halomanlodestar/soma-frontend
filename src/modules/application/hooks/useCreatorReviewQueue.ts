"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import {
  GetCreatorReviewApplicantDocument,
  GetCreatorReviewQueueDocument,
} from "@/modules/application/api/creator-review-documents";

export function useCreatorReviewQueue(enabled: boolean) {
  const [somaId, setSomaId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const { data, loading, error } = useQuery(GetCreatorReviewQueueDocument, {
    variables: { somaId },
    skip: !enabled || !somaId,
    fetchPolicy: "network-only",
  });
  const applications = (data?.somaCreatorReviewQueue ?? []).filter(
    (application) =>
      application.status === "SUBMITTED" || application.status === "IN_REVIEW",
  );
  const selectedApplication =
    applications.find(
      (application) => application.id === selectedApplicationId,
    ) ?? null;
  const { data: applicantData, loading: applicantLoading } = useQuery(
    GetCreatorReviewApplicantDocument,
    {
      variables: { id: selectedApplication?.applicantId ?? "" },
      skip: !enabled || !selectedApplication,
    },
  );
  const applicant =
    applicantData?.getUserById.__typename === "UserResponseDto"
      ? applicantData.getUserById.profile
      : null;

  const selectSoma = (nextSomaId: string) => {
    setSomaId(nextSomaId);
    setSelectedApplicationId(null);
  };

  return {
    somaId,
    applications,
    selectedApplication,
    applicant,
    applicantLoading,
    loading,
    error,
    selectSoma,
    selectApplication: setSelectedApplicationId,
  };
}
