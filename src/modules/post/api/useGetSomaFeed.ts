import { useQuery } from "@apollo/client/react";

import { graphql } from "@/gql";
import type { Post } from "@/modules/post/types";

const GetSomaFeedDocument = graphql(`
  query GetSomaFeed($somaId: String!, $limit: Int) {
    getSomaFeed(somaId: $somaId, limit: $limit) {
      id
      title
      excerpt
      body
      mediaUrl
      media {
        items {
          originalUrl
          type
          metadata {
            width
            height
          }
        }
      }
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
        }
      }
    }
  }
`);

export function useGetSomaFeed(somaId?: string) {
  const { data, loading, error } = useQuery(GetSomaFeedDocument, {
    variables: { somaId: somaId ?? "", limit: 20 },
    skip: !somaId,
  });

  const posts: Post[] | null = data?.getSomaFeed
    ? data.getSomaFeed.map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt ?? "",
        content: item.body ?? "",
        mediaUrl: item.mediaUrl ?? undefined,
        attachments: item.media?.items ?? [],
        createdAt: item.createdAt,
        soma: { name: item.soma.name, slug: item.soma.slug },
        author: {
          name: item.author.profile.displayName ?? item.author.profile.username,
          username: item.author.profile.username,
          avatarUrl: item.author.profile.avatarUrl ?? undefined,
          isVerified: item.author.emailVerified,
          bio: "",
          stats: {
            posts: 0,
            comments: 0,
          },
          awards: [],
        },
        stats: { upvotes: item.voteCount, comments: item.commentCount },
        userVoteValue: item.userVoteValue,
      }))
    : null;

  return { data: posts, isLoading: loading, error };
}
