/** @format */

"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from "lucide-react";

import { useGetPostById } from "@/modules/post/api/useGetPostById";
import { useGetComments } from "@/modules/comment/api/useGetComments";
import { CommentTree } from "@/modules/comment/components/CommentTree";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PostPageProps {
  params: Promise<{ somaSlug: string; postId: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const { postId } = use(params);

  const { data: post, isLoading: postLoading } = useGetPostById(postId);
  const { data: comments, isLoading: commentsLoading } = useGetComments(postId);

  if (postLoading || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto w-full max-w-350 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <Skeleton className="w-full aspect-4/3 rounded-2xl" />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <Skeleton className="h-[80vh] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Pure Media */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center items-center h-[60vh] lg:h-[85vh] lg:sticky lg:top-20">
            {post.mediaUrl && (
              <div className="relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center">
                <Image
                  src={post.mediaUrl}
                  alt={post.title}
                  fill
                  className="object-contain rounded-2xl shadow-sm"
                  priority
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Author, Caption, Comments, Actions */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[85vh] lg:sticky lg:top-20 border border-border/40 rounded-2xl bg-card shadow-sm overflow-hidden">
            {/* Header: Author Info */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 shrink-0 bg-card z-10">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href={`/u/${post.author.username}`}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <Avatar className="size-10 ring-1 ring-border group-hover:ring-primary/50 transition-colors">
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
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {post.author.name}
                        </span>
                        {post.author.isVerified && (
                          <BadgeCheck
                            className="size-3.5 text-primary"
                            aria-label="Verified Human"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link
                          href={`/s/${post.soma.slug}`}
                          className="font-medium text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          s/{post.soma.slug}
                        </Link>
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
                </HoverCardContent>
              </HoverCard>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground h-8 w-8"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>

            {/* Scrollable Comments Area (including Caption) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Caption as Top Comment */}
              <div className="flex gap-3 mb-6">
                <Avatar className="size-8 ring-1 ring-border shrink-0">
                  <AvatarImage src={post.author.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {post.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full pt-0.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Link
                      href={`/u/${post.author.username}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {post.author.username}
                    </Link>
                    {post.author.isVerified && (
                      <BadgeCheck className="size-3.5 text-primary" />
                    )}
                  </div>
                  <div className="mt-2 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    <h1 className="text-base font-bold mb-2 text-foreground">
                      {post.title}
                    </h1>
                    {post.content || post.excerpt}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">
                    {timeAgo}
                  </span>
                </div>
              </div>

              <hr className="border-border/40 mb-2" />

              <div className="mt-4">
                <CommentTree comments={comments} isLoading={commentsLoading} />
              </div>
            </div>

            {/* Action Bar (Pinned to Bottom) */}
            <div className="flex flex-col p-3 border-t border-border/40 shrink-0 bg-card z-10">
              <div className="flex items-center gap-1 mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Heart className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="size-5" />
                </Button>
              </div>
              <div className="px-2 pb-1 flex items-center gap-3 text-sm font-semibold text-foreground">
                <span>{post.stats.upvotes} likes</span>
                <span className="text-muted-foreground font-normal text-xs">
                  {timeAgo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
