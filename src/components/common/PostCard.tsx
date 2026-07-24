/** @format */

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, BadgeCheck, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Post } from "@/modules/post/api/useGetPosts";
import { ShareDialog } from "./ShareDialog";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const shareUrl = `https://soma.art/p/${post.id}`;

  return (
    <Card className="w-full overflow-hidden border-border/40 bg-card transition-colors hover:bg-accent/5">
      <CardContent className="flex flex-col gap-4 sm:p-4">
        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-sm">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer group">
                <Avatar className="size-9 ring-1 ring-border group-hover:ring-primary/50 transition-colors">
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
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-medium hover:text-foreground transition-colors">
                      s/{post.soma.slug}
                    </span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                  </div>
                </div>
              </div>
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
                        className="flex items-center gap-1.5 text-xs font-medium bg-accent px-2 py-1 rounded-md"
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

        {/* Content (Title is dominant) */}
        <div className="group flex cursor-pointer flex-col gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        {/* Media Preview (if exists) */}
        {post.mediaUrl && (
          <div className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-muted">
            <Image
              src={post.mediaUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Interaction Row (Visually quiet) */}
        <div className="-ml-2 flex items-center gap-1 pt-1 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 hover:text-primary"
          >
            <Heart className="size-4" />
            <span className="text-xs font-medium">{post.stats.upvotes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 hover:text-foreground"
          >
            <MessageCircle className="size-4" />
            <span className="text-xs font-medium">{post.stats.comments}</span>
          </Button>

          <ShareDialog url={shareUrl} title={post.title}>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-8 px-2 hover:text-foreground"
            >
              <Share2 className="size-4" />
            </Button>
          </ShareDialog>
        </div>
      </CardContent>
    </Card>
  );
}
