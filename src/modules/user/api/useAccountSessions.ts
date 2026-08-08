"use client";

import { useMutation, useQuery } from "@apollo/client/react";

import { graphql } from "@/gql";

const MySessionsDocument = graphql(`
  query MyAccountSessions {
    mySessions {
      id
      clientType
      deviceName
      userAgent
      createdAt
      lastUsedAt
      expiresAt
    }
  }
`);

const RevokeSessionDocument = graphql(`
  mutation RevokeAccountSession($sessionId: String!) {
    revokeSession(sessionId: $sessionId)
  }
`);

const RevokeAllSessionsDocument = graphql(`
  mutation RevokeAllAccountSessions {
    revokeAllSessions
  }
`);

export function useAccountSessions() {
  const { data, loading, error, refetch } = useQuery(MySessionsDocument);
  const [revokeSessionMutation, { loading: isRevokingSession }] = useMutation(RevokeSessionDocument);
  const [revokeAllSessionsMutation, { loading: isRevokingAll }] = useMutation(RevokeAllSessionsDocument);

  const revokeSession = async (sessionId: string) => {
    const result = await revokeSessionMutation({ variables: { sessionId } });
    if (!result.data?.revokeSession) throw new Error("We could not sign out that session.");
    await refetch();
  };

  const revokeAllSessions = async () => {
    await revokeAllSessionsMutation();
    await refetch();
  };

  return { sessions: data?.mySessions ?? [], isLoading: loading, error, revokeSession, revokeAllSessions, isRevokingSession, isRevokingAll };
}
