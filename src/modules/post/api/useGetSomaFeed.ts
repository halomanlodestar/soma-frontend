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
      createdAt
      voteCount
      userVoteValue
      commentCount
      soma {
        name
        slug
      }
      author {
        displayName
        username
        avatarUrl
        isVerified
        stats {
          posts
          comments
        }
        awards
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
        createdAt: item.createdAt,
        soma: { name: item.soma.name, slug: item.soma.slug },
        author: {
          name: item.author.displayName ?? item.author.username,
          username: item.author.username,
          avatarUrl: item.author.avatarUrl ?? undefined,
          isVerified: item.author.isVerified,
          bio: "",
          stats: {
            posts: item.author.stats?.posts ?? 0,
            comments: item.author.stats?.comments ?? 0,
          },
          awards: (item.author.awards ?? []).filter((award): award is string => award !== null),
        },
        stats: { upvotes: item.voteCount, comments: item.commentCount },
        userVoteValue: item.userVoteValue,
      }))
    : null;

  return { data: posts, isLoading: loading, error };
}
