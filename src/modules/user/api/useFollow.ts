"use client";

import { useMutation, useQuery } from "@apollo/client/react";

import { graphql } from "@/gql";

const GetFollowStatusDocument = graphql(`
  query GetFollowStatus($userId: String!) {
    getFollowStatus(userId: $userId) {
      __typename
      isFollowing
    }
  }
`);

const FollowDocument = graphql(`
  mutation Follow($userId: String!) {
    follow(userId: $userId) {
      __typename
      ... on FollowResponse {
        success
        responseMessage: message
      }
      ... on InvalidInputError {
        errorMessage: message
      }
      ... on NotFoundError {
        errorMessage: message
      }
    }
  }
`);

const UnfollowDocument = graphql(`
  mutation Unfollow($userId: String!) {
    unfollow(userId: $userId) {
      __typename
      success
      message
    }
  }
`);

export function useFollow(userId?: string) {
  const { data, loading } = useQuery(GetFollowStatusDocument, {
    variables: { userId: userId ?? "" },
    skip: !userId,
  });
  const [followMutation, followState] = useMutation(FollowDocument);
  const [unfollowMutation, unfollowState] = useMutation(UnfollowDocument);

  const isFollowing = data?.getFollowStatus.isFollowing ?? false;

  const toggleFollow = async () => {
    if (!userId) return;

    if (isFollowing) {
      const result = await unfollowMutation({
        variables: { userId },
        optimisticResponse: { unfollow: { __typename: "FollowResponse", success: true, message: null } },
        update: (cache) => {
          cache.writeQuery({
            query: GetFollowStatusDocument,
            variables: { userId },
            data: { getFollowStatus: { __typename: "FollowStatus", isFollowing: false } },
          });
        },
      });

      if (!result.data?.unfollow.success) {
        throw new Error(result.data?.unfollow.message ?? "We could not unfollow this creator.");
      }

      return false;
    }

    const result = await followMutation({
      variables: { userId },
      optimisticResponse: {
        follow: { __typename: "FollowResponse", success: true, responseMessage: null },
      },
      update: (cache) => {
        cache.writeQuery({
          query: GetFollowStatusDocument,
          variables: { userId },
          data: { getFollowStatus: { __typename: "FollowStatus", isFollowing: true } },
        });
      },
    });
    const follow = result.data?.follow;

    if (!follow || follow.__typename !== "FollowResponse" || !follow.success) {
      throw new Error(
        follow && "errorMessage" in follow && follow.errorMessage
          ? follow.errorMessage
          : "We could not follow this creator.",
      );
    }

    return true;
  };

  return {
    isFollowing,
    isLoading: loading,
    isUpdating: followState.loading || unfollowState.loading,
    toggleFollow,
  };
}
