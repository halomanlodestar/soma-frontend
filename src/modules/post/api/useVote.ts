import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";
import type { TargetType } from "@/gql/graphql";

const UPSERT_VOTE = graphql(`
  mutation UpsertVote($data: CreateVoteDto!) {
    upsertVote(data: $data)
  }
`);

const REMOVE_VOTE = graphql(`
  mutation RemoveVote($data: DeleteVoteDto!) {
    removeVote(data: $data)
  }
`);

export const useVote = () => {
  const [upsertVoteMut] = useMutation(UPSERT_VOTE);
  const [removeVoteMut] = useMutation(REMOVE_VOTE);

  const vote = async (targetId: string, targetType: TargetType, value: number, currentVoteValue: number | null | undefined) => {
    const isNewVote = currentVoteValue == null || currentVoteValue === 0;
    const voteDiff = isNewVote ? value : (value - currentVoteValue);

    await upsertVoteMut({
      variables: {
        data: {
          targetId,
          targetType,
          value,
        },
      },
      optimisticResponse: {
        upsertVote: true,
      },
      update: (cache) => {
        const typeNames = targetType === "POST" ? ["Post", "FeedItem"] : ["Comment"];
        typeNames.forEach(typeName => {
          cache.modify({
            id: cache.identify({ __typename: typeName, id: targetId }),
            fields: {
              userVoteValue() {
                return value;
              },
              voteCount(currentCount: number = 0) {
                return currentCount + voteDiff;
              },
            },
          });
        });
      },
    });
  };

  const removeVote = async (targetId: string, targetType: TargetType, currentVoteValue: number) => {
    await removeVoteMut({
      variables: {
        data: {
          targetId,
          targetType,
        },
      },
      optimisticResponse: {
        removeVote: true,
      },
      update: (cache) => {
        const typeNames = targetType === "POST" ? ["Post", "FeedItem"] : ["Comment"];
        typeNames.forEach(typeName => {
          cache.modify({
            id: cache.identify({ __typename: typeName, id: targetId }),
            fields: {
              userVoteValue() {
                return null;
              },
              voteCount(currentCount: number = 0) {
                return currentCount - currentVoteValue;
              },
            },
          });
        });
      },
    });
  };

  return { vote, removeVote };
};
