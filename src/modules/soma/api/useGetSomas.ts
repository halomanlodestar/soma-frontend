/** @format */

import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Soma } from "../types";

const GET_ALL_SOMAS = graphql(`
  query GetAllSomas {
    getAllSomas {
      id
      name
      slug
      description
      memberCount
      weeklyVisitorCount
      coverUrl
    }
  }
`);

export const useGetSomas = () => {
  const { data: queryData, loading, error } = useQuery(GET_ALL_SOMAS);

  const somas: Soma[] | null = queryData?.getAllSomas
    ? queryData.getAllSomas.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description || "",
        memberCount: item.memberCount,
        weeklyVisitorCount: item.weeklyVisitorCount,
        coverUrl: item.coverUrl || undefined,
      }))
    : null;

  return { data: somas, isLoading: loading, error };
};
