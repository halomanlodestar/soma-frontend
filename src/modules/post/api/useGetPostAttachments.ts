import { useQuery } from "@apollo/client/react";

import { graphql } from "@/gql";
import type { PostAttachment } from "@/modules/post/types";

const GetPostAttachmentsDocument = graphql(`
  query GetPostAttachments($postId: String!) {
    getMediaByPost(postId: $postId) {
      items {
        originalUrl
        type
      }
    }
  }
`);

export function useGetPostAttachments(postId: string, skip = false) {
  const { data, loading, error } = useQuery(GetPostAttachmentsDocument, {
    variables: { postId },
    skip: !postId || skip,
  });

  const attachments: PostAttachment[] = data?.getMediaByPost?.items ?? [];

  return { data: attachments, isLoading: loading, error };
}
