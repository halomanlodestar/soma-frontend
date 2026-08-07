import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const GET_ME = graphql(`
  query GetMe {
    me {
      __typename
      ... on UserResponseDto {
        id
        email
        platformRole
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

export const useGetMe = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const user = data?.me?.__typename === "UserResponseDto" ? data.me : null;
  const me = user
    ? {
        ...user,
        ...user.profile,
        role: user.platformRole,
        isVerified: user.emailVerified,
      }
    : null;

  return { me, isLoading: loading, error };
};
