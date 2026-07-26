import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Post } from "../types";

const GET_POST_BY_ID = graphql(`
  query GetPostById($id: String!) {
    getPostById(id: $id) {
      __typename
      ... on Post {
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
  }
`);

export const useGetPostById = (postId: string) => {
  const { data: queryData, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  });

  const postData = queryData?.getPostById;
  const item = postData?.__typename === 'Post' ? postData : null;

  const post: Post | null = item ? {
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
    userVoteValue: item.userVoteValue,
  } : null;

  return { data: post, isLoading: loading, error };
};
