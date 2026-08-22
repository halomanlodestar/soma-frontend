import type {
  GetCreatorReviewApplicantQuery,
  GetSomaCreatorReviewQueueQuery,
  SomaCreatorApplicationStatus,
} from "@/gql/graphql";

export type ReviewApplication =
  GetSomaCreatorReviewQueueQuery["somaCreatorReviewQueue"][number];

export type ReviewApplicant = Extract<
  GetCreatorReviewApplicantQuery["getUserById"],
  { __typename: "UserResponseDto" }
>["profile"];

export type ReviewDecision = Extract<
  SomaCreatorApplicationStatus,
  "APPROVED" | "NEEDS_INFO" | "DECLINED"
>;

export type ReviewValues = { reviewerNote: string };
