import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { UserProfile } from "../types";

const GET_USER_BY_USERNAME = graphql(`
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      __typename
      ... on UserResponseDto {
        id
        emailVerified
        profile {
          username
          displayName
          bio
          avatarUrl
          coverUrl
        }
      }
    }
  }
`);

export const useGetUserByUsername = (username: string) => {
  const { data: queryData, loading, error } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username },
  });

  const userData = queryData?.userByUsername;
  const item = userData?.__typename === 'UserResponseDto' ? userData : null;

  const userProfile: UserProfile | null = item ? {
    id: item.id,
    name: item.profile.displayName || item.profile.username,
    username: item.profile.username,
    avatarUrl: item.profile.avatarUrl || undefined,
    coverUrl: item.profile.coverUrl || undefined,
    bio: item.profile.bio || "",
    isVerified: item.emailVerified,
    joinedAt: "",
    stats: {
      posts: 0,
      comments: 0,
      followers: 0,
      following: 0,
    },
    awards: [],
  } : null;

  return { data: userProfile, isLoading: loading, error };
};
