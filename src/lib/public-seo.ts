import "server-only";

import { cache } from "react";
import {
  GetPostByIdDocument,
  GetSomaBySlugDocument,
  GetUserByUsernameDocument,
} from "@/gql/graphql";
import { getClient } from "@/lib/apollo-rsc";

export const getPublicSomaSeo = cache(async (slug: string) => {
  try {
    const { data } = await getClient().query({
      query: GetSomaBySlugDocument,
      variables: { slug },
    });

    const soma = data?.getSomaBySlug;
    return soma?.__typename === "Soma"
      ? soma
      : null;
  } catch {
    return null;
  }
});

export const getPublicPostSeo = cache(async (id: string) => {
  try {
    const { data } = await getClient().query({
      query: GetPostByIdDocument,
      variables: { id },
    });

    const post = data?.getPostById;
    return post?.__typename === "Post" ? post : null;
  } catch {
    return null;
  }
});

export const getPublicProfileSeo = cache(async (username: string) => {
  try {
    const { data } = await getClient().query({
      query: GetUserByUsernameDocument,
      variables: { username },
    });

    const profile = data?.userByUsername;
    return profile?.__typename === "UserResponseDto"
      ? profile
      : null;
  } catch {
    return null;
  }
});
