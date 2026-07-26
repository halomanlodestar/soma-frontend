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
        bio
        stats {
          posts
          comments
        }
        awards
      }
    }
  }
`);

export const useGetPostsByUser = (userId?: string) => {
  const { data: queryData, loading, error } = useQuery(GET_POSTS_BY_USER, {
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
          name: item.author.displayName || item.author.username,
          username: item.author.username,
          avatarUrl: item.author.avatarUrl || undefined,
          isVerified: item.author.isVerified,
          bio: item.author.bio || "",
          stats: {
            posts: item.author.stats?.posts || 0,
            comments: item.author.stats?.comments || 0,
          },
          awards: (item.author.awards || []).filter((a): a is string => a !== null),
        },
        stats: {
          upvotes: item.voteCount,
          comments: item.commentCount,
        },
      }))
    : null;

  return { data: posts, isLoading: loading, error };
};
