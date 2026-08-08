"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useNotificationActor } from "../api/useNotificationActor";
import { getNotificationView } from "../lib/event-data";
import type { Notification } from "../types";

export function NotificationRow({ notification, marking, onMarkRead }: { notification: Notification; marking: boolean; onMarkRead: (id: string) => Promise<void> }) {
  const view = getNotificationView(notification);
  const profile = useNotificationActor(notification.actorId);
  const actor = profile?.displayName || profile?.username || "Someone";
  const isUnread = !notification.readAt;

  return <article className={cn("relative -mx-3 flex gap-3 rounded-xl px-3 py-6 transition-colors duration-200 hover:bg-muted/65 focus-within:bg-muted/65 motion-reduce:transition-none sm:gap-4", isUnread && "before:absolute before:inset-y-6 before:left-0 before:w-0.5 before:rounded-full before:bg-primary")}>
    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border/60", isUnread && "bg-primary/10 text-primary ring-primary/15")}><view.Icon aria-hidden="true" className="size-4" /></div>
    <div className="min-w-0 flex-1 pl-1 sm:pl-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {view.href ? <Link className="font-heading text-[1.0625rem] font-medium tracking-[-0.015em] underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={view.href} onClick={() => { if (isUnread) void onMarkRead(notification.id); }}>{view.title(actor)}</Link> : <h2 className="font-heading text-[1.0625rem] font-medium tracking-[-0.015em]">{view.title(actor)}</h2>}
          <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
        </div>
        {isUnread && <Button disabled={marking} onClick={() => void onMarkRead(notification.id)} size="sm" variant="outline"><Check data-icon="inline-start" />{marking ? "Saving" : "Mark read"}</Button>}
      </div>
      <p className={cn("mt-3 text-sm leading-6", view.href ? "text-foreground" : "text-muted-foreground")}>{view.detail}</p>
    </div>
  </article>;
}
