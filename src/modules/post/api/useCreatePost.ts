/** @format */

"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { graphql } from "@/gql";
import { getResultErrorMessage } from "@/lib/graphql-errors";

const CreateUploadIntentDocument = graphql(`
  mutation CreateUploadIntent($data: UploadIntentDto!) {
    createUploadIntent(data: $data) {
      assetId
      presignedUploadUrl
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const publishPost = async ({
    body,
    file,
    somaId,
    title,
  }: PublishPostInput) => {
    const uploadIntentResult = await createUploadIntent({
      variables: {
        data: {
          byteSize: file.size,
          fileName: file.name,
          mediaType: "IMAGE",
          mimeType: file.type,
          purpose: "POST_MEDIA",
          somaId,
        },
      },
    });

    const uploadIntent = uploadIntentResult.data?.createUploadIntent;

    if (!uploadIntent) {
      throw new Error(
        "We could not prepare that image for upload. Please try again.",
      );
    }

    setUploadProgress(0);

    try {
      await uploadFile(
        uploadIntent.presignedUploadUrl,
        file,
        setUploadProgress,
      );
    } finally {
      setUploadProgress(null);
    }

    const createResult = await createPost({
      variables: {
        data: {
          body,
          somaId,
          title,
          media: [
            { assetId: uploadIntent.assetId, altText: title, caption: body },
          ],
        },
      },
    });

    const post = createResult.data?.createPost;

    if (!post || post.__typename !== "Post") {
      throw new Error(
        getResultErrorMessage(post, "We could not save this work."),
      );
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

  return { publishPost, uploadProgress };
}

function uploadFile(
  url: string,
  file: File,
  onProgress: (progress: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable)
        onProgress(Math.round((event.loaded / event.total) * 100));
    };

    request.onerror = () =>
      reject(new Error("The image upload did not finish. Please try again."));
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error("The image upload did not finish. Please try again."));
      }
    };

    request.send(file);
  });
}
