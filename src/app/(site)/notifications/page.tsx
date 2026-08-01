"use client";

import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Sparkles } from "lucide-react";

import { graphql } from "@/gql";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/modules/user/api/useGetMe";

const GetNotificationsDocument = graphql(`
  query GetNotifications {
    getNotifications {
      __typename
      id
      type
      message
      createdAt
      readAt
      postId
      commentId
    }
  }
`);

const MarkNotificationAsReadDocument = graphql(`
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
`);

export default function NotificationsPage() {
  const { me, isLoading: meLoading } = useGetMe();
  const { data, loading, error } = useQuery(GetNotificationsDocument, { skip: !me });
  const [markAsRead, { loading: marking }] = useMutation(MarkNotificationAsReadDocument);
  const notifications = data?.getNotifications ?? [];

  const markRead = async (id: string) => {
    await markAsRead({
      variables: { id },
      optimisticResponse: { markNotificationAsRead: { __typename: "Notification", id, readAt: new Date().toISOString() } },
      update: (cache, { data: result }) => {
        const notification = result?.markNotificationAsRead;
        if (notification?.__typename !== "Notification") return;
        cache.modify({
          id: cache.identify(notification),
          fields: { readAt: () => notification.readAt },
        });
      },
    });
  };

  if (meLoading || loading) return <NotificationsSkeleton />;

  if (!me) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign in to see your notifications</CardTitle>
            <CardDescription>Responses to your work and activity around the Somas you inhabit appear here.</CardDescription>
          </CardHeader>
          <CardContent><Button asChild><Link href="/login">Log in</Link></Button></CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Your activity</p>
          <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em]">Notifications</h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <Card><CardHeader><CardTitle>Notifications are unavailable</CardTitle><CardDescription>Refresh and try again in a moment.</CardDescription></CardHeader></Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles data-icon="inline-start" />Nothing new yet</CardTitle>
              <CardDescription>When someone responds to your work, it will land here.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.readAt ? "" : "ring-primary/30"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><Bell data-icon="inline-start" />{notification.type}</CardTitle>
                  <CardDescription>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <p className="text-sm leading-6 text-foreground">{notification.message}</p>
                  {!notification.readAt && <Button variant="outline" size="sm" disabled={marking} onClick={() => void markRead(notification.id)}><Check data-icon="inline-start" />Read</Button>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function NotificationsSkeleton() {
  return <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="h-12 w-64" />{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32 w-full" />)}</div>;
}
