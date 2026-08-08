"use client";

import Link from "next/link";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
import {
  AtSign,
  Bell,
  Check,
  Heart,
  MessageCircle,
  RefreshCw,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/modules/user/api/useGetMe";

type Notification = {
  __typename: "Notification";
  id: string;
  eventType: string;
  eventData: string;
  actorId: string | null;
  recipientId: string;
  createdAt: string;
  readAt: string | null;
};

type GetNotificationsQuery = { getNotifications: Notification[] };

type MarkNotificationAsReadMutation = {
  markNotificationAsRead:
    | { __typename: "Notification"; id: string; readAt: string | null }
    | { __typename: "NotFoundError"; message: string }
    | { __typename: "UnauthorizedError"; message: string };
};

const GetNotificationsDocument = gql`
  query GetNotifications {
    getNotifications {
      __typename
      id
      eventType
      eventData
      actorId
      recipientId
      createdAt
      readAt
    }
  }
`;

const MarkNotificationAsReadDocument = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      __typename
      ... on Notification {
        id
        readAt
      }
      ... on NotFoundError {
        message
      }
      ... on UnauthorizedError {
        message
      }
    }
  }
`;

const notificationPresentation = {
  COMMENT: { label: "New comment", Icon: MessageCircle },
  FOLLOW: { label: "New follower", Icon: UserPlus },
  LIKE: { label: "New appreciation", Icon: Heart },
  MENTION: { label: "You were mentioned", Icon: AtSign },
} as const;

function getNotificationPresentation(eventType: string) {
  return (
    notificationPresentation[eventType as keyof typeof notificationPresentation] ?? {
      label: eventType.replace(/_/g, " ").toLowerCase(),
      Icon: Bell,
    }
  );
}

function getNotificationMessage(eventData: string) {
  try {
    const data = JSON.parse(eventData) as Record<string, unknown>;
    const message = ["message", "content", "text", "description", "title"]
      .map((key) => data[key])
      .find((value): value is string => typeof value === "string" && value.trim().length > 0);

    if (message) return message;
  } catch {
    // The API may return an opaque event payload. In that case, use the value as plain text.
  }

  return eventData || "There is new activity around your work.";
}

export default function NotificationsPage() {
  const { me, isLoading: meLoading } = useGetMe();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const { data, loading, error, refetch, networkStatus } = useQuery<GetNotificationsQuery>(
    GetNotificationsDocument,
    {
      skip: !me,
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      pollInterval: 30_000,
      notifyOnNetworkStatusChange: true,
    },
  );
  const [markAsRead] = useMutation<MarkNotificationAsReadMutation>(MarkNotificationAsReadDocument);
  const notifications = [...(data?.getNotifications ?? [])].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;
  const isRefreshing = networkStatus === 4;

  const markRead = async (id: string) => {
    setMarkingId(id);
    setMutationError(null);

    try {
      const { data: result } = await markAsRead({
        variables: { id },
        optimisticResponse: {
          markNotificationAsRead: {
            __typename: "Notification",
            id,
            readAt: new Date().toISOString(),
          },
        },
        update: (cache, { data: response }) => {
          const notification = response?.markNotificationAsRead;
          if (notification?.__typename !== "Notification") return;
          cache.modify({
            id: cache.identify(notification),
            fields: { readAt: () => notification.readAt },
          });
        },
      });

      if (result?.markNotificationAsRead.__typename !== "Notification") {
        setMutationError(result?.markNotificationAsRead.message ?? "Unable to update this notification.");
      }
    } catch {
      setMutationError("Unable to update this notification. Please try again.");
    } finally {
      setMarkingId(null);
    }
  };

  if (meLoading || (loading && !data)) return <NotificationsSkeleton />;

  if (!me) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md">
          <Bell aria-hidden="true" className="size-6 text-primary" />
          <h1 className="mt-5 font-heading text-3xl font-medium tracking-[-0.04em]">
            Sign in to see your notifications
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Replies, appreciation, and activity around your work appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-muted/20">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                Your activity
              </p>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em]">
                Notifications
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Keep up with the conversations and connections around your work.
              </p>
            </div>
            <Button
              aria-label="Refresh notifications"
              disabled={isRefreshing}
              onClick={() => void refetch()}
              size="icon"
              variant="outline"
            >
              <RefreshCw className={cn(isRefreshing && "animate-spin")} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={unreadCount > 0 ? "default" : "secondary"}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Updates automatically every 30 seconds
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="border-l-2 border-destructive py-1 pl-4">
            <h2 className="font-heading text-lg font-medium">Notifications are unavailable</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              We couldn&apos;t load your latest activity. Try again in a moment.
            </p>
            <Button className="mt-4" onClick={() => void refetch()} variant="outline">
              <RefreshCw data-icon="inline-start" />
              Try again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <section className="flex min-h-72 flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Sparkles aria-hidden="true" className="size-5" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.03em]">
              Nothing new yet
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              When someone responds to your work, it will land here.
            </p>
          </section>
        ) : (
          <section aria-label="Notification list">
            {mutationError && (
              <p aria-live="polite" className="text-sm text-destructive">
                {mutationError}
              </p>
            )}
            <div className="border-y border-border">
              {notifications.map((notification, index) => {
              const { label, Icon } = getNotificationPresentation(notification.eventType);
              const isUnread = !notification.readAt;
              const message = getNotificationMessage(notification.eventData);

              return (
                <div key={notification.id}>
                  <article
                    className={cn(
                      "relative flex gap-3 py-5 sm:gap-4",
                      isUnread && "before:absolute before:inset-y-5 before:left-0 before:w-0.5 before:bg-primary",
                    )}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Icon aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1 pl-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="flex flex-wrap items-center gap-2 font-heading text-base font-medium">
                          {label}
                          {isUnread && <Badge>New</Badge>}
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                          </p>
                        </div>
                        {isUnread && (
                      <Button
                        disabled={markingId === notification.id}
                        onClick={() => void markRead(notification.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Check data-icon="inline-start" />
                        {markingId === notification.id ? "Saving" : "Mark read"}
                      </Button>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-foreground">{message}</p>
                    </div>
                  </article>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-5 w-80" />
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton className="h-36 w-full" key={index} />
      ))}
    </div>
  );
}
