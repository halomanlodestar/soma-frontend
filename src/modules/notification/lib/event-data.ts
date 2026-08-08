import { Award, Bell, MessageCircle, type LucideIcon } from "lucide-react";
import { z } from "zod";

import type { Notification } from "../types";

const commentCreated = z.object({ context: z.object({ postId: z.string() }), template: z.object({ key: z.literal("notification.comment.created"), variables: z.object({ postTitle: z.string() }) }) });
const awardGranted = z.object({ context: z.object({ targetType: z.enum(["POST", "COMMENT"]), targetId: z.string() }), template: z.object({ key: z.literal("notification.award.granted"), variables: z.object({ awardName: z.string() }) }) });

export type NotificationView = { title: (actor: string) => string; detail: string; href: string | null; Icon: LucideIcon };

function parse(data: unknown) { if (typeof data !== "string") return data; try { return JSON.parse(data) as unknown; } catch { return null; } }

export function getNotificationView(notification: Notification): NotificationView {
  const data = parse(notification.eventData);
  if (notification.eventType === "comment.created.v1") {
    const event = commentCreated.safeParse(data);
    if (event.success) return { title: (actor) => `${actor} commented on your post`, detail: event.data.template.variables.postTitle, href: `/posts/${event.data.context.postId}`, Icon: MessageCircle };
  }
  if (notification.eventType === "award.granted.v1") {
    const event = awardGranted.safeParse(data);
    if (event.success) return { title: (actor) => `${actor} gave you an award`, detail: event.data.template.variables.awardName, href: `/${event.data.context.targetType === "COMMENT" ? "comments" : "posts"}/${event.data.context.targetId}`, Icon: Award };
  }
  return { title: () => "New activity", detail: "This content is no longer available", href: null, Icon: Bell };
}
