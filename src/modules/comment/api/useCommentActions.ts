"use client";

import { useMutation } from "@apollo/client/react";

import { graphql } from "@/gql";
import { getResultErrorMessage } from "@/lib/graphql-errors";

const CreateCommentDocument = graphql(`
  mutation CreateComment($postId: String!, $data: CreateCommentDto!) {
    createComment(postId: $postId, data: $data) {
      __typename
      ... on Comment {
        id
      }
      ... on InvalidInputError {
        message
      }
      ... on NotFoundError {
        message
      }
      ... on UnauthorizedError {
        message
      }
    }
  }
`);

const ReplyToCommentDocument = graphql(`
  mutation ReplyToComment($commentId: String!, $data: CreateCommentDto!) {
    replyToComment(commentId: $commentId, data: $data) {
      __typename
      ... on Comment {
        id
      }
      ... on InvalidInputError {
        message
      }
      ... on NotFoundError {
        message
      }
      ... on UnauthorizedError {
        message
      }
    }
  }
`);

export function useCommentActions() {
  const [createComment] = useMutation(CreateCommentDocument);
  const [replyToComment] = useMutation(ReplyToCommentDocument);

  const addComment = async (postId: string, content: string) => {
    const result = await createComment({ variables: { postId, data: { content } } });
    const comment = result.data?.createComment;

    if (!comment || comment.__typename !== "Comment") {
      throw new Error(getResultErrorMessage(comment, "We could not add your thought."));
    }
  };

  const addReply = async (commentId: string, content: string) => {
    const result = await replyToComment({ variables: { commentId, data: { content } } });
    const reply = result.data?.replyToComment;

    if (!reply || reply.__typename !== "Comment") {
      throw new Error(getResultErrorMessage(reply, "We could not add your reply."));
    }
  };

  return { addComment, addReply };
}
