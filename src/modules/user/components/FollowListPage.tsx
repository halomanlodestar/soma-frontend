"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { ArrowLeft, UsersRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { graphql } from "@/gql";
import { useGetUserByUsername } from "@/modules/user/api/useGetUserByUsername";

const GET_FOLLOWERS = graphql(`
  query GetFollowers($userId: String!) {
    getFollowers(userId: $userId) {
      id
      displayName
      username
    }
  }
`);

const GET_FOLLOWING = graphql(`
  query GetFollowing($userId: String!) {
    getFollowing(userId: $userId) {
      id
      displayName
      username
    }
  }
`);

type FollowListKind = "followers" | "following";

interface FollowListPageProps {
  username: string;
  kind: FollowListKind;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function FollowListSkeleton() {
  return (
    <div className="border-y border-border" aria-label="Loading people">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border py-4 last:border-b-0"
        >
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FollowListPage({ username, kind }: FollowListPageProps) {
  const { data: user, isLoading: userLoading, error: userError } =
    useGetUserByUsername(username);
  const followersQuery = useQuery(GET_FOLLOWERS, {
    variables: { userId: user?.id ?? "" },
    skip: !user?.id || kind !== "followers",
    fetchPolicy: "cache-and-network",
  });
  const followingQuery = useQuery(GET_FOLLOWING, {
    variables: { userId: user?.id ?? "" },
    skip: !user?.id || kind !== "following",
    fetchPolicy: "cache-and-network",
  });

  const activeQuery = kind === "followers" ? followersQuery : followingQuery;
  const people =
    kind === "followers"
      ? followersQuery.data?.getFollowers
      : followingQuery.data?.getFollowing;
  const label = kind === "followers" ? "Followers" : "Following";
  const description =
    kind === "followers"
      ? `People following ${user?.name ?? `@${username}`}`
      : `People ${user?.name ?? `@${username}`} follows`;
  const isLoading = userLoading || activeQuery.loading;
  const error = userError ?? activeQuery.error;

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Button variant="ghost" size="sm" asChild className="-ml-3 mb-8">
        <Link href={`/u/${username}`}>
          <ArrowLeft data-icon="inline-start" />
          Back to profile
        </Link>
      </Button>

      <header className="mb-8 border-b border-border pb-7">
        <p className="mb-2 text-sm text-muted-foreground">@{username}</p>
        <h1 className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
          {label}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </header>

      {isLoading ? (
        <FollowListSkeleton />
      ) : error ? (
        <section className="border-y border-border py-14 text-center">
          <h2 className="font-heading text-2xl font-medium">Couldn’t load this list</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </section>
      ) : !user ? (
        <section className="border-y border-border py-14 text-center">
          <h2 className="font-heading text-2xl font-medium">Profile not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This profile may no longer be available.
          </p>
        </section>
      ) : people && people.length > 0 ? (
        <section className="border-y border-border" aria-label={`${label} list`}>
          {people.map((person) => {
            const name = person.displayName || person.username;

            return (
              <Link
                key={person.id}
                href={`/u/${person.username}`}
                className="group flex items-center gap-3 border-b border-border py-4 last:border-b-0 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <Avatar size="lg">
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground group-hover:text-primary">
                    {name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{person.username}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className="flex flex-col items-center border-y border-border py-16 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-accent">
            <UsersRound className="size-5 text-primary" />
          </div>
          <h2 className="mt-5 font-heading text-2xl font-medium">No {label.toLowerCase()} yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {kind === "followers"
              ? "When people follow this profile, they’ll appear here."
              : "Profiles this person follows will appear here."}
          </p>
        </section>
      )}
    </main>
  );
}
