import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";

import { GetNotificationsDocument } from "./documents";
import type { Notification } from "../types";

type GetNotificationsQuery = { getNotifications: Notification[] };

export function useNotifications(recipientId?: string) {
  const { data, refetch, ...query } = useQuery<GetNotificationsQuery>(GetNotificationsDocument, {
    skip: !recipientId,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const refreshOnReturn = () => {
      if (document.visibilityState === "visible" && recipientId) void refetch();
    };
    document.addEventListener("visibilitychange", refreshOnReturn);
    return () => document.removeEventListener("visibilitychange", refreshOnReturn);
  }, [refetch, recipientId]);

  return {
    ...query,
    data,
    refetch,
    notifications: (data?.getNotifications ?? []).filter((item) => item.recipientId === recipientId),
  };
}
