/** @format */

"use client";

import type { ApolloCache } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

import { graphql } from "@/gql";
import { getResultErrorMessage } from "@/lib/graphql-errors";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { GetCommentsByPostDocument } from "./useGetComments";

const CreateCommentDocument = graphql(`
  mutation CreateComment($postId: String!, $data: CreateCommentDto!) {
    createComment(postId: $postId, data: $data) {
      __typename
      ... on AsyncAccepted {
        commandId
      }
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
      ... on AsyncAccepted {
        commandId
      }
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

function isAcceptedCommentCommand(
  result: { __typename?: string } | null | undefined,
) {
  return result?.__typename === "Comment" || result?.__typename === "AsyncAccepted";
}

export function useCommentActions() {
  const [createComment] = useMutation(CreateCommentDocument);
  const [replyToComment] = useMutation(ReplyToCommentDocument);
  const { me } = useGetMe();

  const createOptimisticComment = (
    id: string,
    postId: string,
    content: string,
    parentCommentId: string | null,
  ) => ({
    __typename: "Comment" as const,
    id,
    postId,
    parentCommentId,
    content,
    voteCount: 0,
    userVoteValue: null,
    createdAt: new Date().toISOString(),
    author: {
      __typename: "UserResponseDto" as const,
      displayName: me?.displayName ?? me?.username ?? "You",
      username: me?.username ?? "you",
      avatarUrl: me?.avatarUrl ?? null,
      isVerified: me?.isVerified ?? false,
    },
  });

  const addToCommentCache = (
    cache: ApolloCache,
    postId: string,
    optimisticComment: ReturnType<typeof createOptimisticComment>,
  ) => {
    cache.updateQuery(
      { query: GetCommentsByPostDocument, variables: { postId } },
      (data) => {
        if (!data || data.getCommentsByPost.some((comment) => comment.id === optimisticComment.id)) {
          return data;
        }

        return {
          ...data,
          getCommentsByPost: [...data.getCommentsByPost, optimisticComment],
        };
      },
    );
  };

  const addComment = async (postId: string, content: string) => {
    const optimisticComment = createOptimisticComment(
      `client:comment:${crypto.randomUUID()}`,
      postId,
      content,
      null,
    );
    const result = await createComment({
      variables: { postId, data: { content } },
      optimisticResponse: {
        createComment: {
          __typename: "AsyncAccepted",
          commandId: optimisticComment.id,
        },
      },
      update: (cache, { data }) => {
        if (isAcceptedCommentCommand(data?.createComment)) {
          addToCommentCache(cache, postId, optimisticComment);
        }
      },
    });
    const comment = result.data?.createComment;

    if (!isAcceptedCommentCommand(comment)) {
      throw new Error(
        getResultErrorMessage(comment, "We could not add your thought."),
      );
    }
  };

  const addReply = async (postId: string, commentId: string, content: string) => {
    const optimisticReply = createOptimisticComment(
      `client:comment:${crypto.randomUUID()}`,
      postId,
      content,
      commentId,
    );
    const result = await replyToComment({
      variables: { commentId, data: { content } },
      optimisticResponse: {
        replyToComment: {
          __typename: "AsyncAccepted",
          commandId: optimisticReply.id,
        },
      },
      update: (cache, { data }) => {
        if (isAcceptedCommentCommand(data?.replyToComment)) {
          addToCommentCache(cache, postId, optimisticReply);
        }
      },
    });
    const reply = result.data?.replyToComment;

    if (!isAcceptedCommentCommand(reply)) {
      throw new Error(
        getResultErrorMessage(reply, "We could not add your reply."),
      );
    }
  };

  return { addComment, addReply };
}
