import { useQuery } from "@apollo/client/react";

import { GetNotificationActorDocument } from "./documents";
import type { NotificationActor } from "../types";

type ActorQuery = { getUserById: { __typename: string; profile?: NotificationActor } };

export function useNotificationActor(actorId: string | null) {
  const { data } = useQuery<ActorQuery>(GetNotificationActorDocument, { variables: { id: actorId ?? "" }, skip: !actorId });
  return data?.getUserById.__typename === "UserResponseDto" ? data.getUserById.profile ?? null : null;
}
