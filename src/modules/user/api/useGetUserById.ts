import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { UserProfile } from "../types";

const GET_USER_BY_ID = graphql(`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      __typename
      ... on UserResponseDto {
        id
        displayName
        username
        avatarUrl
        coverUrl
        bio
        isVerified
        createdAt
        stats {
          posts
          comments
          followers
          following
        }
        awards
      }
    }
  }
`);

export const useGetUserById = (userId: string) => {
  const { data: queryData, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const userData = queryData?.getUserById;
  const item = userData?.__typename === 'UserResponseDto' ? userData : null;

  const userProfile: UserProfile | null = item ? {
    id: item.id,
    name: item.displayName || item.username,
    username: item.username,
    avatarUrl: item.avatarUrl || undefined,
    coverUrl: item.coverUrl || undefined,
    bio: item.bio || "",
    isVerified: item.isVerified,
    joinedAt: item.createdAt,
    stats: {
      posts: item.stats?.posts || 0,
      comments: item.stats?.comments || 0,
      followers: item.stats?.followers || 0,
      following: item.stats?.following || 0,
    },
    awards: (item.awards || []).filter((a): a is string => a !== null),
  } : null;

  return { data: userProfile, isLoading: loading, error };
};
