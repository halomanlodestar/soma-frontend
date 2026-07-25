/** @format */

"use client";

import { HttpLink } from "@apollo/client";
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { SetContextLink } from "@apollo/client/link/context";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:8000/graphql",
  });

  const authLink = new SetContextLink((prevContext, request) => {
    const { headers } = prevContext;
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
