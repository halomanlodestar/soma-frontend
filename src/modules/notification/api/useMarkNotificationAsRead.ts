import { useMutation } from "@apollo/client/react";

import { MarkNotificationAsReadDocument } from "./documents";
import type { MarkNotificationAsReadResult } from "../types";

type MutationData = { markNotificationAsRead: MarkNotificationAsReadResult };

export function useMarkNotificationAsRead() {
  const [mutate] = useMutation<MutationData>(MarkNotificationAsReadDocument);

  return async (id: string) => {
    const result = await mutate({
      variables: { id },
      optimisticResponse: { markNotificationAsRead: { __typename: "Notification", id, readAt: new Date().toISOString() } },
      update: (cache, { data }) => {
        const notification = data?.markNotificationAsRead;
        if (notification?.__typename !== "Notification") return;
        cache.modify({ id: cache.identify(notification), fields: { readAt: () => notification.readAt } });
      },
    });
    return result.data?.markNotificationAsRead;
  };
}
