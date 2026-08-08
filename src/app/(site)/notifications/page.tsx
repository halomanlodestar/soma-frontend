/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMarkNotificationAsRead } from "@/modules/notification/api/useMarkNotificationAsRead";
import { useNotifications } from "@/modules/notification/api/useNotifications";
import { NotificationsList } from "@/modules/notification/components/NotificationsList";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { NotificationsSkeleton } from "@/modules/notification/components/NotificationSkeleton";

export default function NotificationsPage() {
  const { me, isLoading: meLoading } = useGetMe();
  const { notifications, data, loading, error, refetch, networkStatus } =
    useNotifications(me?.id);
  const markAsRead = useMarkNotificationAsRead();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const unreadCount = notifications.filter((item) => !item.readAt).length;
  const isRefreshing = networkStatus === 4;

  const markRead = async (id: string) => {
    setMarkingId(id);
    setMutationError(null);
    try {
      const result = await markAsRead(id);

      if (result?.__typename !== "Notification")
        setMutationError(
          result?.message ?? "Unable to update this notification.",
        );
    } catch {
      setMutationError("Unable to update this notification. Please try again.");
    } finally {
      setMarkingId(null);
    }
  };

  if (meLoading || (loading && !data)) return <NotificationsSkeleton />;

  if (!me)
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md">
          <Bell aria-hidden="true" className="size-6 text-primary" />
          <h1 className="mt-5 font-heading text-3xl font-medium tracking-[-0.04em]">
            Sign in to see your notifications
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Replies and recognition around your work appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-muted/30">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                Your activity
              </p>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em]">
                Notifications
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Keep up with the conversations and recognition around your work.
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
          <Badge className="rounded-full px-2.5" variant={unreadCount > 0 ? "default" : "secondary"}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </Badge>
        </div>
      </header>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="border-l-2 border-destructive py-1 pl-4">
            <h2 className="font-heading text-lg font-medium">
              Notifications are unavailable
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              We couldn&apos;t load your latest activity. Try again in a moment.
            </p>
            <Button
              className="mt-4"
              onClick={() => void refetch()}
              variant="outline"
            >
              <RefreshCw data-icon="inline-start" />
              Try again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <section className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-8 ring-secondary/35">
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
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Inbox</p>
              <p className="text-xs text-muted-foreground">Newest first</p>
            </div>
            {mutationError && (
              <p aria-live="polite" className="mb-4 text-sm text-destructive">
                {mutationError}
              </p>
            )}
            <NotificationsList
              notifications={notifications}
              markingId={markingId}
              onMarkRead={markRead}
            />
          </section>
        )}
      </div>
    </main>
  );
}
