/** @format */

import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Post } from "../types";

const GET_POSTS_BY_USER = graphql(`
  query GetPostsByUser($userId: String!) {
    getPostsByUser(userId: $userId) {
      id
      title
      excerpt
      body
      mediaUrl
      createdAt
      voteCount
      userVoteValue
      commentCount
      soma {
        name
        slug
      }
      author {
        emailVerified
        profile {
          username
          displayName
          avatarUrl
          bio
        }
      }
    }
  }
`);

export const useGetPostsByUser = (userId?: string) => {
  const {
    data: queryData,
    loading,
    error,
  } = useQuery(GET_POSTS_BY_USER, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  const posts: Post[] | null = queryData?.getPostsByUser
    ? queryData.getPostsByUser.map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || "",
        content: item.body || "",
        mediaUrl: item.mediaUrl || undefined,
        createdAt: item.createdAt,
        soma: {
          name: item.soma.name,
          slug: item.soma.slug,
        },
        author: {
          name: item.author.profile.displayName || item.author.profile.username,
          username: item.author.profile.username,
          avatarUrl: item.author.profile.avatarUrl || undefined,
          isVerified: item.author.emailVerified,
          bio: item.author.profile.bio || "",
          stats: {
            posts: 0,
            comments: 0,
          },
          awards: [],
        },
        stats: {
          upvotes: item.voteCount,
          comments: item.commentCount,
        },
        userVoteValue: item.userVoteValue,
      }))
    : null;

  return { data: posts, isLoading: loading, error };
};
