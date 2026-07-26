import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const GET_ME = graphql(`
  query GetMe {
    me {
      __typename
      ... on UserResponseDto {
        id
        displayName
        username
        avatarUrl
        role
        isVerified
      }
    }
  }
`);

export const useGetMe = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const me = data?.me?.__typename === "UserResponseDto" ? data.me : null;

  return { me, isLoading: loading, error };
};
