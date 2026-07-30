/** @format */

"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

type RefreshResponse = {
  accessToken: string;
  accessTokenExpiresIn: number;
};

let accessToken: string | null = null;
let accessTokenExpiresAt = 0;
let refreshInFlight: Promise<string | null> | null = null;
let initialRefreshAttempted = false;

export function clearAccessToken() {
  accessToken = null;
  accessTokenExpiresAt = 0;
  initialRefreshAttempted = true;
}

async function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        initialRefreshAttempted = true;
        if (!response.ok) {
          accessToken = null;
          accessTokenExpiresAt = 0;
          return null;
        }

        const body = (await response.json()) as RefreshResponse;
        if (!body.accessToken || !Number.isFinite(body.accessTokenExpiresIn)) return null;

        accessToken = body.accessToken;
        // Refresh early so no request starts with an almost-expired token.
        accessTokenExpiresAt = Date.now() + Math.max(0, body.accessTokenExpiresIn - 30) * 1000;
        initialRefreshAttempted = true;
        return accessToken;
      })
      .catch(() => {
        initialRefreshAttempted = true;
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

export async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken;
  if (initialRefreshAttempted && !accessToken) return null;
  return refreshSession();
}

async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = await getAccessToken();
  const request = new Request(input, {
    ...init,
    credentials: "omit",
    headers: {
      ...(input instanceof Request ? Object.fromEntries(input.headers) : {}),
      ...(init?.headers ? Object.fromEntries(new Headers(init.headers)) : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  const response = await fetch(request.clone());
  if (response.status !== 401 || !(await refreshSession())) return response;

  request.headers.set("authorization", `Bearer ${accessToken}`);
  return fetch(request);
}

function makeClient() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
  const httpLink = new HttpLink({
    uri: `${apiUrl}/graphql`,
    fetch: authenticatedFetch,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
