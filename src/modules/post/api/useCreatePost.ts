"use client";

import { useMutation } from "@apollo/client/react";

import { graphql } from "@/gql";
import { getResultErrorMessage } from "@/lib/graphql-errors";

const CreateUploadIntentDocument = graphql(`
  mutation CreateUploadIntent($data: UploadIntentDto!) {
    createUploadIntent(data: $data) {
      key
      presignedUploadUrl
      finalPublicUrl
    }
  }
`);

const CreatePostDocument = graphql(`
  mutation CreatePost($data: CreatePostDto!) {
    createPost(data: $data) {
      __typename
      ... on Post {
        id
        title
        visibility
        soma {
          slug
        }
      }
      ... on InvalidInputError {
        message
      }
      ... on UnauthorizedError {
        message
      }
    }
  }
`);

const SubmitPostDocument = graphql(`
  mutation SubmitPost($id: String!) {
    submitPost(id: $id) {
      __typename
      ... on Post {
        id
        title
        visibility
        soma {
          slug
        }
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

type PublishPostInput = {
  body: string;
  file: File;
  somaId: string;
  title: string;
};

export function useCreatePost() {
  const [createUploadIntent] = useMutation(CreateUploadIntentDocument);
  const [createPost] = useMutation(CreatePostDocument);
  const [submitPost] = useMutation(SubmitPostDocument);

  const publishPost = async ({ body, file, somaId, title }: PublishPostInput) => {
    const uploadIntentResult = await createUploadIntent({
      variables: {
        data: {
          fileName: file.name,
          mediaType: "IMAGE",
          mimeType: file.type,
          somaId,
        },
      },
    });

    const uploadIntent = uploadIntentResult.data?.createUploadIntent;
    if (!uploadIntent) {
      throw new Error("We could not prepare that image for upload. Please try again.");
    }

    const uploadResponse = await fetch(uploadIntent.presignedUploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("The image upload did not finish. Please try again.");
    }

    const createResult = await createPost({
      variables: {
        data: {
          body,
          somaId,
          title,
          media: [{ key: uploadIntent.key, type: "IMAGE" }],
        },
      },
    });
    const post = createResult.data?.createPost;

    if (!post || post.__typename !== "Post") {
      throw new Error(getResultErrorMessage(post, "We could not save this work."));
    }

    const submitResult = await submitPost({ variables: { id: post.id } });
    const submittedPost = submitResult.data?.submitPost;

    if (!submittedPost || submittedPost.__typename !== "Post") {
      throw new Error(
        getResultErrorMessage(
          submittedPost,
          "Your work was saved, but could not be submitted for review.",
        ),
      );
    }

    return submittedPost;
  };

  return { publishPost };
}
