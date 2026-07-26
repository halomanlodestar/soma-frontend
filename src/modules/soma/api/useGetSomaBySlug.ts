import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Soma } from "../types";

const GET_SOMA_BY_SLUG = graphql(`
  query GetSomaBySlug($slug: String!) {
    getSomaBySlug(slug: $slug) {
      __typename
      ... on Soma {
        id
        name
        slug
        description
        memberCount
        weeklyVisitorCount
        coverUrl
      }
    }
  }
`);

export const useGetSomaBySlug = (slug: string) => {
  const { data: queryData, loading, error } = useQuery(GET_SOMA_BY_SLUG, {
    variables: { slug },
  });

  const somaData = queryData?.getSomaBySlug;
  const item = somaData?.__typename === 'Soma' ? somaData : null;

  const soma: Soma | null = item ? {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description || "",
    memberCount: item.memberCount,
    weeklyVisitorCount: item.weeklyVisitorCount,
    coverUrl: item.coverUrl || undefined,
  } : null;

  return { data: soma, isLoading: loading, error };
};
