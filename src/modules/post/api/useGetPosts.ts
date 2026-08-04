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
        displayName
        username
        avatarUrl
        isVerified
        stats {
          posts
          comments
        }
        awards
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
          name: item.author.displayName || item.author.username,
          username: item.author.username,
          avatarUrl: item.author.avatarUrl || undefined,
          isVerified: item.author.isVerified,
          bio: "",
          stats: {
            posts: item.author.stats?.posts || 0,
            comments: item.author.stats?.comments || 0,
          },
          awards: (item.author.awards || []).filter(
            (a): a is string => a !== null,
          ),
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
