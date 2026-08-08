"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
import { Award, Bell, Check, MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/modules/user/api/useGetMe";

type Notification = {
  id: string;
  recipientId: string;
  actorId: string | null;
  eventType: string;
  eventData: unknown;
  readAt: string | null;
  createdAt: string;
};

type GetNotificationsQuery = { getNotifications: Notification[] };
type ActorQuery = {
  getUserById:
    | { __typename: "UserResponseDto"; profile: { displayName: string | null; username: string } }
    | { __typename: "NotFoundError" | "UnauthorizedError"; message: string };
};
type MarkNotificationAsReadMutation = {
  markNotificationAsRead:
    | { __typename: "Notification"; id: string; readAt: string | null }
    | { __typename: "NotFoundError"; message: string }
    | { __typename: "UnauthorizedError"; message: string };
};

const GetNotificationsDocument = gql`
  query GetNotifications {
    getNotifications {
      id
      recipientId
      actorId
      eventType
      eventData
      readAt
      createdAt
    }
  }
`;

const GetNotificationActorDocument = gql`
  query GetNotificationActor($id: String!) {
    getUserById(id: $id) {
      __typename
      ... on UserResponseDto {
        profile {
          displayName
          username
        }
      }
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

const commentCreatedSchema = z.object({
  resource: z.object({ type: z.literal("comment"), id: z.string() }),
  context: z.object({ postId: z.string() }),
  template: z.object({
    key: z.literal("notification.comment.created"),
    variables: z.object({ postTitle: z.string() }),
  }),
});

const awardGrantedSchema = z.object({
  resource: z.object({ type: z.literal("award"), id: z.string() }),
  context: z.object({ targetType: z.enum(["POST", "COMMENT"]), targetId: z.string() }),
  template: z.object({
    key: z.literal("notification.award.granted"),
    variables: z.object({ awardName: z.string() }),
  }),
});

type NotificationView = {
  title: (actorName: string) => string;
  detail: string | null;
  href: string | null;
  Icon: typeof Bell;
};

function parseEventData(eventData: unknown) {
  if (typeof eventData !== "string") return eventData;

  try {
    return JSON.parse(eventData) as unknown;
  } catch {
    return null;
  }
}

function getNotificationView(notification: Notification): NotificationView {
  const data = parseEventData(notification.eventData);

  if (notification.eventType === "comment.created.v1") {
    const result = commentCreatedSchema.safeParse(data);
    if (result.success) {
      return {
        title: (actorName) => `${actorName} commented on your post`,
        detail: result.data.template.variables.postTitle,
        href: `/posts/${result.data.context.postId}`,
        Icon: MessageCircle,
      };
    }
  }

  if (notification.eventType === "award.granted.v1") {
    const result = awardGrantedSchema.safeParse(data);
    if (result.success) {
      return {
        title: (actorName) => `${actorName} gave you an award`,
        detail: result.data.template.variables.awardName,
        href:
          result.data.context.targetType === "COMMENT"
            ? `/comments/${result.data.context.targetId}`
            : `/posts/${result.data.context.targetId}`,
        Icon: Award,
      };
    }
  }

  return {
    title: () => "New activity",
    detail: "This content is no longer available",
    href: null,
    Icon: Bell,
  };
}

export default function NotificationsPage() {
  const { me, isLoading: meLoading } = useGetMe();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const { data, loading, error, refetch, networkStatus } = useQuery<GetNotificationsQuery>(
    GetNotificationsDocument,
    { skip: !me, fetchPolicy: "network-only", nextFetchPolicy: "cache-first", notifyOnNetworkStatusChange: true },
  );
  const [markAsRead] = useMutation<MarkNotificationAsReadMutation>(MarkNotificationAsReadDocument);
  const notifications = (data?.getNotifications ?? []).filter(
    (notification) => notification.recipientId === me?.id,
  );
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;
  const isRefreshing = networkStatus === 4;

  useEffect(() => {
    const refreshOnReturn = () => {
      if (document.visibilityState === "visible" && me) void refetch();
    };

    document.addEventListener("visibilitychange", refreshOnReturn);
    return () => document.removeEventListener("visibilitychange", refreshOnReturn);
  }, [me, refetch]);

  const markRead = async (id: string) => {
    setMarkingId(id);
    setMutationError(null);

    try {
      const { data: result } = await markAsRead({
        variables: { id },
        optimisticResponse: {
          markNotificationAsRead: { __typename: "Notification", id, readAt: new Date().toISOString() },
        },
        update: (cache, { data: response }) => {
          const notification = response?.markNotificationAsRead;
          if (notification?.__typename !== "Notification") return;
          cache.modify({ id: cache.identify(notification), fields: { readAt: () => notification.readAt } });
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
          <h1 className="mt-5 font-heading text-3xl font-medium tracking-[-0.04em]">Sign in to see your notifications</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Replies and recognition around your work appear here.</p>
          <Button asChild className="mt-6"><Link href="/login">Log in</Link></Button>
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
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Your activity</p>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em]">Notifications</h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Keep up with the conversations and recognition around your work.</p>
            </div>
            <Button aria-label="Refresh notifications" disabled={isRefreshing} onClick={() => void refetch()} size="icon" variant="outline">
              <RefreshCw className={cn(isRefreshing && "animate-spin")} />
            </Button>
          </div>
          <Badge variant={unreadCount > 0 ? "default" : "secondary"}>{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}</Badge>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="border-l-2 border-destructive py-1 pl-4">
            <h2 className="font-heading text-lg font-medium">Notifications are unavailable</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">We couldn&apos;t load your latest activity. Try again in a moment.</p>
            <Button className="mt-4" onClick={() => void refetch()} variant="outline"><RefreshCw data-icon="inline-start" />Try again</Button>
          </div>
        ) : notifications.length === 0 ? (
          <section className="flex min-h-72 flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><Sparkles aria-hidden="true" className="size-5" /></div>
            <h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.03em]">Nothing new yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">When someone responds to your work, it will land here.</p>
          </section>
        ) : (
          <section aria-label="Notification list">
            {mutationError && <p aria-live="polite" className="mb-4 text-sm text-destructive">{mutationError}</p>}
            <div className="border-y border-border">
              {notifications.map((notification, index) => (
                <Fragment key={notification.id}>
                  <NotificationRow notification={notification} marking={markingId === notification.id} onMarkRead={markRead} />
                  {index < notifications.length - 1 && <Separator />}
                </Fragment>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function NotificationRow({ notification, marking, onMarkRead }: { notification: Notification; marking: boolean; onMarkRead: (id: string) => Promise<void> }) {
  const view = getNotificationView(notification);
  const { data } = useQuery<ActorQuery>(GetNotificationActorDocument, { variables: { id: notification.actorId ?? "" }, skip: !notification.actorId });
  const actor = data?.getUserById.__typename === "UserResponseDto" ? data.getUserById.profile.displayName || data.getUserById.profile.username : "Someone";
  const isUnread = !notification.readAt;

  return (
    <article className={cn("relative flex gap-3 py-5 sm:gap-4", isUnread && "before:absolute before:inset-y-5 before:left-0 before:w-0.5 before:bg-primary")}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><view.Icon aria-hidden="true" className="size-4" /></div>
      <div className="min-w-0 flex-1 pl-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {view.href ? (
              <Link className="font-heading text-base font-medium underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={view.href} onClick={() => { if (isUnread) void onMarkRead(notification.id); }}>
                {view.title(actor)}
              </Link>
            ) : <h2 className="font-heading text-base font-medium">{view.title(actor)}</h2>}
            <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
          </div>
          {isUnread && <Button disabled={marking} onClick={() => void onMarkRead(notification.id)} size="sm" variant="outline"><Check data-icon="inline-start" />{marking ? "Saving" : "Mark read"}</Button>}
        </div>
        {view.detail && <p className={cn("mt-3 text-sm leading-6", view.href ? "text-foreground" : "text-muted-foreground")}>{view.detail}</p>}
      </div>
    </article>
  );
}

function NotificationsSkeleton() {
  return <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="h-10 w-52" /><Skeleton className="h-5 w-80" />{Array.from({ length: 3 }).map((_, index) => <Skeleton className="h-28 w-full" key={index} />)}</div>;
}
