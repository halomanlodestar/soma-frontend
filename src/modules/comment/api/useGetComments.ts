import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { Comment } from "../types";

export const GetCommentsByPostDocument = graphql(`
  query GetCommentsByPost($postId: String!) {
    getCommentsByPost(postId: $postId) {
      id
      postId
      parentCommentId
      content
      voteCount
      userVoteValue
      createdAt
      author {
        displayName
        username
        avatarUrl
        isVerified
      }
    }
  }
`);

export const useGetComments = (postId: string) => {
  const { data: queryData, loading, error, refetch } = useQuery(GetCommentsByPostDocument, {
    variables: { postId },
  });

  let comments: Comment[] | null = null;

  if (queryData?.getCommentsByPost) {
    const allComments = queryData.getCommentsByPost.map(item => ({
      id: item.id,
      postId: item.postId,
      parentId: item.parentCommentId || null,
      content: item.content,
      author: {
        name: item.author.displayName || item.author.username,
        username: item.author.username,
        avatarUrl: item.author.avatarUrl || undefined,
        isVerified: item.author.isVerified,
      },
      stats: { upvotes: item.voteCount },
      userVoteValue: item.userVoteValue,
      createdAt: item.createdAt,
      replies: [] as Comment[]
    }));

    // Build tree
    const commentMap = new Map<string, Comment>();
    allComments.forEach(c => commentMap.set(c.id, c));

    comments = [];
    allComments.forEach(c => {
      if (c.parentId && commentMap.has(c.parentId)) {
        commentMap.get(c.parentId)!.replies!.push(c);
      } else {
        comments!.push(c);
      }
    });
  }

  return { data: comments, isLoading: loading, error, refetch };
};
