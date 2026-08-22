import { graphql } from "@/gql";

export const GetCreatorReviewQueueDocument = graphql(`
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

export const GetCreatorReviewApplicantDocument = graphql(`
  query GetCreatorReviewApplicant($id: String!) {
    getUserById(id: $id) {
      __typename
      ... on UserResponseDto {
        id
        profile {
          username
          displayName
          bio
          avatarUrl
        }
      }
    }
  }
`);

export const ReviewCreatorApplicationDocument = graphql(`
  mutation ReviewCreatorApplication(
    $input: ReviewSomaCreatorApplicationInput!
  ) {
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
