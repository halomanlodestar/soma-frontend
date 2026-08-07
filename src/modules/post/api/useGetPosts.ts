/** @format */

import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Post } from "../types";

const GET_POSTS = graphql(`
  query GetGlobalFeed {
    getGlobalFeed {
      id
      title
      excerpt
      mediaUrl
      media {
        items {
          originalUrl
          type
        }
      }
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
        }
      }
    }
  }
`);

export const useGetPosts = () => {
  const { data: queryData, loading, error } = useQuery(GET_POSTS);

  const posts: Post[] | null = queryData?.getGlobalFeed
    ? queryData.getGlobalFeed.map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || "",
        mediaUrl: item.mediaUrl || undefined,
        attachments: item.media?.items ?? [],
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
          bio: "",
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
