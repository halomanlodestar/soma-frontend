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

function getPersistedCommentId(
  result: { __typename?: string; id?: string; commandId?: string },
) {
  if (result.__typename === "AsyncAccepted") {
    return result.commandId;
  }

  return result.id;
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

  const reconcileCommentCache = (
    cache: ApolloCache,
    postId: string,
    optimisticComment: ReturnType<typeof createOptimisticComment>,
    persistedId: string,
  ) => {
    const persistedComment = { ...optimisticComment, id: persistedId };

    cache.updateQuery(
      { query: GetCommentsByPostDocument, variables: { postId } },
      (data) => {
        if (!data) {
          return data;
        }

        const temporaryCommentIndex = data.getCommentsByPost.findIndex(
          (comment) => comment.id === optimisticComment.id,
        );
        if (temporaryCommentIndex >= 0) {
          return {
            ...data,
            getCommentsByPost: data.getCommentsByPost.map((comment, index) =>
              index === temporaryCommentIndex ? persistedComment : comment,
            ),
          };
        }

        if (data.getCommentsByPost.some((comment) => comment.id === persistedId)) {
          return data;
        }

        return {
          ...data,
          getCommentsByPost: [...data.getCommentsByPost, persistedComment],
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
        const persistedId = data?.createComment && getPersistedCommentId(data.createComment);
        if (persistedId) {
          reconcileCommentCache(cache, postId, optimisticComment, persistedId);
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
        const persistedId = data?.replyToComment && getPersistedCommentId(data.replyToComment);
        if (persistedId) {
          reconcileCommentCache(cache, postId, optimisticReply, persistedId);
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
