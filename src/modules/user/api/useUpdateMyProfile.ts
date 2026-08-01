"use client";

import { useMutation } from "@apollo/client/react";

import { graphql } from "@/gql";
import { getResultErrorMessage } from "@/lib/graphql-errors";

const UpdateMyProfileDocument = graphql(`
  mutation UpdateMyProfile($data: UpdateUserProfileDto!) {
    updateMyProfile(data: $data) {
      __typename
      ... on UserResponseDto {
        id
        displayName
        username
        avatarUrl
        coverUrl
        bio
      }
      ... on NotFoundError {
        message
      }
    }
  }
`);

export function useUpdateMyProfile() {
  const [updateMyProfile] = useMutation(UpdateMyProfileDocument);

  const updateProfile = async (data: {
    avatarUrl?: string;
    bio?: string;
    coverUrl?: string;
    displayName?: string;
  }) => {
    const result = await updateMyProfile({ variables: { data } });
    const profile = result.data?.updateMyProfile;

    if (!profile || profile.__typename !== "UserResponseDto") {
      throw new Error(getResultErrorMessage(profile, "We could not update your profile."));
    }

    return profile;
  };

  return { updateProfile };
}
