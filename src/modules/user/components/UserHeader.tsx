/** @format */

import Image from "next/image";
import { BadgeCheck, Trophy, CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { UserProfile } from "@/modules/user/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UserHeaderProps {
  user: UserProfile | null;
  isLoading: boolean;
}

export function UserHeader({ user, isLoading }: UserHeaderProps) {
  if (isLoading || !user) {
    return (
      <div className="w-full flex flex-col">
        <Skeleton className="h-48 md:h-64 w-full rounded-none" />
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col gap-4 pb-6">
            <Skeleton className="size-32 rounded-full border-4 border-background" />
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const joinDate = format(new Date(user.joinedAt), "MMMM yyyy");

  return (
    <div className="w-full flex flex-col border-b border-border/40 bg-background pb-6">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 w-full bg-muted overflow-hidden">
        {user.coverUrl && (
          <Image
            src={user.coverUrl}
            alt="cover"
            fill
            className="object-cover opacity-90"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile Avatar & Actions */}
        <div className="relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <Avatar className="size-32 rounded-full border-4 border-background bg-card shadow-lg">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-3xl font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="font-semibold shadow-sm">
              Message
            </Button>
            <Button className="font-semibold shadow-sm px-6">Follow</Button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-4 mt-4 z-10">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {user.name}
              {user.isVerified && (
                <BadgeCheck className="size-6 text-primary" />
              )}
            </h1>
            <p className="text-primary font-medium">@{user.username}</p>
          </div>

          <p className="text-base text-foreground/90 max-w-2xl leading-relaxed">
            {user.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Joined {joinDate}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              {user.stats.following}{" "}
              <span className="text-muted-foreground font-normal">
                Following
              </span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              {user.stats.followers}{" "}
              <span className="text-muted-foreground font-normal">
                Followers
              </span>
            </span>
          </div>

          {user.awards && user.awards.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.awards.map((award, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-accent px-2.5 py-1 rounded-md text-foreground"
                >
                  <Trophy className="size-3.5 text-amber-500" />
                  {award}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
