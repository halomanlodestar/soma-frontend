export type Notification = {
  id: string;
  recipientId: string;
  actorId: string | null;
  eventType: string;
  eventData: unknown;
  readAt: string | null;
  createdAt: string;
};

export type NotificationActor = { displayName: string | null; username: string };

export type MarkNotificationAsReadResult =
  | { __typename: "Notification"; id: string; readAt: string | null }
  | { __typename: "NotFoundError"; message: string }
  | { __typename: "UnauthorizedError"; message: string };
