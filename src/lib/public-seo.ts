import "server-only";

import { cache } from "react";
import { graphql } from "@/gql";
import { getClient } from "@/lib/apollo-rsc";

const GetPublicSomaSeoDocument = graphql(`
  query GetPublicSomaSeo($slug: String!) {
    getSomaBySlug(slug: $slug) {
      __typename
      ... on Soma {
        id
        name
        slug
        description
        coverUrl
        createdAt
        updatedAt
      }
    }
  }
`);

const GetPublicPostSeoDocument = graphql(`
  query GetPublicPostSeo($id: String!) {
    getPostById(id: $id) {
      __typename
      ... on Post {
        id
        title
        excerpt
        body
        mediaUrl
        createdAt
        updatedAt
        visibility
        soma {
          name
          slug
        }
        author {
          displayName
          username
        }
      }
    }
  }
`);

const GetPublicProfileSeoDocument = graphql(`
  query GetPublicProfileSeo($username: String!) {
    userByUsername(username: $username) {
      __typename
      ... on UserResponseDto {
        displayName
        username
        avatarUrl
        coverUrl
        bio
        createdAt
        updatedAt
      }
    }
  }
`);

export const getPublicSomaSeo = cache(async (slug: string) => {
  try {
    const { data } = await getClient().query({
      query: GetPublicSomaSeoDocument,
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
      query: GetPublicPostSeoDocument,
      variables: { id },
    });

    const post = data?.getPostById;
    return post?.__typename === "Post" && post.visibility === "PUBLISHED"
      ? post
      : null;
  } catch {
    return null;
  }
});

export const getPublicProfileSeo = cache(async (username: string) => {
  try {
    const { data } = await getClient().query({
      query: GetPublicProfileSeoDocument,
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
