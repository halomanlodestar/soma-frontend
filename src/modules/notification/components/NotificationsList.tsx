"use client";

import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";

import { NotificationRow } from "./NotificationRow";
import type { Notification } from "../types";

export function NotificationsList({ notifications, markingId, onMarkRead }: { notifications: Notification[]; markingId: string | null; onMarkRead: (id: string) => Promise<void> }) {
  return <div>{notifications.map((notification, index) => <Fragment key={notification.id}><NotificationRow notification={notification} marking={markingId === notification.id} onMarkRead={onMarkRead} />{index < notifications.length - 1 && <Separator />}</Fragment>)}</div>;
}
