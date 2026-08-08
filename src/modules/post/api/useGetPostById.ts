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
  }
`);

export const useGetPostById = (postId: string) => {
  const { data: queryData, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  });

  const postData = queryData?.getPostById;
  const item = postData?.__typename === 'Post' ? postData : null;
  const isNotFound = postData?.__typename === "NotFoundError";

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
  } : null;

  return { data: post, isLoading: loading, error, isNotFound };
};
