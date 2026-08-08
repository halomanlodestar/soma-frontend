import { gql } from "@apollo/client";

export const GetNotificationsDocument = gql`
  query GetNotifications { getNotifications { id recipientId actorId eventType eventData readAt createdAt } }
`;

export const GetNotificationActorDocument = gql`
  query GetNotificationActor($id: String!) {
    getUserById(id: $id) { __typename ... on UserResponseDto { profile { displayName username } } }
  }
`;

export const MarkNotificationAsReadDocument = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      __typename
      ... on Notification { id readAt }
      ... on NotFoundError { message }
      ... on UnauthorizedError { message }
    }
  }
`;
