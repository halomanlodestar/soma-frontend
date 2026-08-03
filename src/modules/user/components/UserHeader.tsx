/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Check, Trophy } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { UserProfile } from "@/modules/user/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuthPrompt } from "@/components/providers/AuthPromptProvider";
import { useFollow } from "@/modules/user/api/useFollow";
import { useGetMe } from "@/modules/user/api/useGetMe";
import { ReportEntryPoint } from "@/components/common/ReportEntryPoint";

interface UserHeaderProps {
  user: UserProfile | null;
  isLoading: boolean;
}

export function UserHeader({ user, isLoading }: UserHeaderProps) {
  const { requestAuth } = useAuthPrompt();
  const { me } = useGetMe();
  const {
    isFollowing,
    isLoading: followLoading,
    isUpdating,
    toggleFollow,
  } = useFollow(user?.id);

  if (isLoading || !user) {
    return (
      <div className="flex w-full flex-col">
        <Skeleton className="h-40 w-full rounded-none sm:h-52" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 flex flex-col gap-5 pb-8 sm:-mt-14">
            <Skeleton className="size-24 rounded-full border-4 border-background sm:size-28" />
            <div className="mt-1 flex flex-col gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const joinDate = format(new Date(user.joinedAt), "MMMM yyyy");

  const handleFollow = () =>
    requestAuth("follow", () => {
      void toggleFollow().catch((error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "We could not update this follow.",
        );
      });
    });

  return (
    <section className="flex w-full flex-col border-b border-border bg-background">
      {/* Cover Image */}
      <div className="relative h-40 w-full overflow-hidden bg-muted sm:h-52">
        {user.coverUrl && (
          <Image
            src={user.coverUrl}
            alt={`${user.name}'s profile cover`}
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/25 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Avatar & Actions */}
        <div className="relative z-10 -mt-12 flex flex-col gap-4 sm:-mt-14 md:flex-row md:items-end md:justify-between">
          <Avatar className="size-24 rounded-full border-4 border-background bg-card shadow-sm sm:size-28">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-medium sm:text-3xl">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 sm:gap-3">
            {me?.id === user.id ? (
              <Button variant="outline" asChild>
                <Link href="/settings">Edit profile</Link>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleFollow}
                  aria-label={isFollowing ? "Unfollow" : "Follow creator"}
                  aria-busy={isUpdating}
                  disabled={followLoading || isUpdating}
                  className={cn(
                    "h-10 min-w-24 transition-colors",
                    isFollowing &&
                      "bg-secondary text-secondary-foreground hover:bg-muted",
                  )}
                >
                  {isFollowing && <Check data-icon="inline-start" />}
                  {isUpdating
                    ? "Updating…"
                    : isFollowing
                      ? "Following"
                      : "Follow"}
                </Button>
                <ReportEntryPoint
                  subject="profile"
                  label={user.name}
                  className="h-10"
                />
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="z-10 mt-5 flex flex-col gap-5 pb-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="flex items-center gap-2 font-heading text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">
              {user.name}
              {user.isVerified && (
                <BadgeCheck
                  className="size-5 text-primary sm:size-6"
                  aria-label="Verified creator"
                />
              )}
            </h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-foreground sm:text-base sm:leading-7">
            {user.bio}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Joined {joinDate}
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              {user.stats.following}{" "}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              {user.stats.followers}{" "}
              <span className="text-muted-foreground">Followers</span>
            </span>
          </div>

          {user.awards && user.awards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.awards.map((award, i) => (
                <Badge key={i} variant="secondary">
                  <Trophy data-icon="inline-start" />
                  {award}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
