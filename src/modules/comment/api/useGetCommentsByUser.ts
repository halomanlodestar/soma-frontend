import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Comment } from "../types";

const GET_COMMENTS_BY_USER = graphql(`
  query GetCommentsByUser($userId: String!) {
    getCommentsByUser(userId: $userId) {
      id
      postId
      parentCommentId
      content
      voteCount
      userVoteValue
      createdAt
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

export const useGetCommentsByUser = (userId?: string) => {
  const { data: queryData, loading, error } = useQuery(GET_COMMENTS_BY_USER, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  let comments: Comment[] | null = null;

  if (queryData?.getCommentsByUser) {
    const allComments = queryData.getCommentsByUser.map(item => ({
      id: item.id,
      postId: item.postId,
      parentId: item.parentCommentId || null,
      content: item.content,
      author: {
        name: item.author.profile.displayName || item.author.profile.username,
        username: item.author.profile.username,
        avatarUrl: item.author.profile.avatarUrl || undefined,
        isVerified: item.author.emailVerified,
      },
      stats: { upvotes: item.voteCount },
      userVoteValue: item.userVoteValue,
      createdAt: item.createdAt,
      replies: [] as Comment[]
    }));

    // For user comments, we might just display them as a flat list, but if CommentTree is used, it expects replies to be filled.
    // If they are isolated comments, they don't form a tree easily without their parents. We'll leave replies empty.
    comments = allComments;
  }

  return { data: comments, isLoading: loading, error };
};
