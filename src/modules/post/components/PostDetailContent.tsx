/** @format */

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trophy,
} from "lucide-react";

import { Post } from "@/modules/post/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PostDetailContentProps {
  post: Post | null;
  isLoading: boolean;
}

export function PostDetailContent({ post, isLoading }: PostDetailContentProps) {
  if (isLoading || !post) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-8">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl mt-4" />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <article className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-8 sm:py-12">
      {/* Header Info */}
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  href={`/u/${post.author.username}`}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <Avatar className="size-12 ring-1 ring-border group-hover:ring-primary/50 transition-colors">
                    <AvatarImage
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {post.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.author.name}
                      </span>
                      {post.author.isVerified && (
                        <BadgeCheck
                          className="size-4 text-primary"
                          aria-label="Verified Human"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Link
                        href={`/s/${post.soma.slug}`}
                        className="font-medium text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        s/{post.soma.slug}
                      </Link>
                      <span>•</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-80 p-5 shadow-xl">
                <div className="flex justify-between space-x-4">
                  <Avatar className="size-14 ring-1 ring-border/50">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback>
                      {post.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-right">
                    <h4 className="text-sm font-semibold flex justify-end items-center gap-1">
                      {post.author.name}
                      {post.author.isVerified && (
                        <BadgeCheck className="size-3.5 text-primary" />
                      )}
                    </h4>
                    <p className="text-xs text-primary font-medium">
                      @{post.author.username}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {post.author.bio}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">
                      {post.author.stats.posts}
                    </span>
                    <span>Posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">
                      {post.author.stats.comments}
                    </span>
                    <span>Comments</span>
                  </div>
                </div>

                {post.author.awards && post.author.awards.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Top Awards
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {post.author.awards.slice(0, 3).map((award, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-xs font-medium bg-accent px-2 py-1 rounded-md text-foreground"
                        >
                          <Trophy className="size-3 text-amber-500" />
                          {award}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          </div>

          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreHorizontal className="size-5" />
          </Button>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Hero Media */}
      {post.mediaUrl && (
        /* eslint-disable-next-line @next/next/no-img-element -- The media API does not expose the intrinsic dimensions required by next/image. */
        <img
          src={post.mediaUrl}
          alt={post.title}
          className="h-auto w-full rounded-2xl bg-muted shadow-sm"
        />
      )}

      {/* Body Content */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.content || post.excerpt}
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-2 pt-6 pb-2 border-y border-border/40 mt-8">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-primary"
        >
          <Heart className="size-5" />
          <span className="font-medium">{post.stats.upvotes}</span>
        </Button>

        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="size-5" />
          <span className="font-medium">{post.stats.comments}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          <Share2 className="size-5" />
        </Button>
      </div>
    </article>
  );
}
