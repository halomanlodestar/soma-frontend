/** @format */

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  Share2,
  BadgeCheck,
  Trophy,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Post } from "@/modules/post/types";
import { ShareDialog } from "./ShareDialog";
import { useVote } from "@/modules/post/api/useVote";
import { useAuthPrompt } from "@/components/providers/AuthPromptProvider";
import { PostAttachments } from "@/modules/post/components/PostAttachments";
import { useGetPostAttachments } from "@/modules/post/api/useGetPostAttachments";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { vote, removeVote } = useVote();
  const { isAuthenticated, requestAuth } = useAuthPrompt();
  const { data: fetchedAttachments } = useGetPostAttachments(
    post.id,
    post.attachments !== undefined,
  );
  const [isUpvoteConfirming, setIsUpvoteConfirming] = React.useState(false);
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const shareUrl = `https://soma.art/p/${post.id}`;

  const hasUpvoted = post.userVoteValue === 1;
  const hasDownvoted = post.userVoteValue === -1;
  const resolvedAttachments = post.attachments ?? fetchedAttachments;
  const displayAttachments = resolvedAttachments.length
    ? resolvedAttachments
    : post.mediaUrl
      ? [{ originalUrl: post.mediaUrl, type: "image" }]
      : [];

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requestAuth("support", () => {
      if (hasUpvoted) {
        removeVote(post.id, "POST", 1);
      } else {
        vote(post.id, "POST", 1, post.userVoteValue);
        setIsUpvoteConfirming(true);
        window.setTimeout(() => setIsUpvoteConfirming(false), 360);
      }
    });
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requestAuth("support", () => {
      if (hasDownvoted) {
        removeVote(post.id, "POST", -1);
      } else {
        vote(post.id, "POST", -1, post.userVoteValue);
      }
    });
  };

  return (
    <article className="group/post flex w-full flex-col gap-5 border-b border-border py-8 first:pt-2 sm:gap-6 sm:py-10">
      {/* Metadata Row */}
      <div className="flex items-center gap-3 text-sm">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-3 group cursor-pointer">
              <Link href={`/u/${post.author.username}`}>
                <Avatar className="size-9 ring-1 ring-border group-hover:ring-primary/50 transition-colors">
                  <AvatarImage
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                  />
                  <AvatarFallback>
                    {post.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/u/${post.author.username}`}
                    className="font-medium text-foreground group-hover:text-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  {post.author.isVerified && (
                    <BadgeCheck
                      className="size-4 text-primary"
                      aria-label="Verified Human"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Link
                    href={`/s/${post.soma.slug}`}
                    className="font-medium hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    s/{post.soma.slug}
                  </Link>
                  <span>•</span>
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            className="w-80 p-5 shadow-xl rounded-xl"
          >
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

      {/* Content */}
      <Link
        href={`/s/${post.soma.slug}/posts/${post.id}`}
        className="group flex cursor-pointer flex-col gap-2.5"
      >
        <h2 className="font-heading text-lg font-medium leading-snug tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary sm:text-xl">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-[0.9375rem] leading-7 text-muted-foreground">
          {post.excerpt}
        </p>
      </Link>

      <PostAttachments
        attachments={displayAttachments}
        postTitle={post.title}
        postHref={`/s/${post.soma.slug}/posts/${post.id}`}
      />

      {/* Interaction Row */}
      <div className="flex items-center justify-between pt-1">
        {/* Voting Group */}
        <div className="flex items-center overflow-hidden rounded-lg border border-border bg-muted/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUpvote}
            className={`h-8 px-2.5 rounded-none hover:bg-accent ${hasUpvoted ? "bg-accent text-primary" : "text-muted-foreground"} ${isUpvoteConfirming ? "motion-safe:animate-[soma-vote-pop_360ms_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
          >
            <ArrowBigUp
              className={`size-4 transition-transform duration-200 ${hasUpvoted ? "fill-current" : ""} ${isUpvoteConfirming ? "scale-110" : ""}`}
            />
          </Button>
          <span
            className={`px-2 text-xs font-medium tabular-nums ${hasUpvoted ? "text-primary" : hasDownvoted ? "text-destructive" : "text-foreground"} ${isUpvoteConfirming ? "motion-safe:animate-[soma-vote-pop_360ms_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
          >
            {post.stats.upvotes}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownvote}
            className={`h-8 px-2.5 rounded-none hover:bg-destructive/10 ${hasDownvoted ? "bg-destructive/10 text-destructive" : "text-muted-foreground"}`}
          >
            <ArrowBigDown
              className={`size-4 ${hasDownvoted ? "fill-current" : ""}`}
            />
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center overflow-hidden rounded-lg border border-border bg-muted/40">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 rounded-none px-3 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <MessageCircle className="size-4.5" />
            <span className="text-xs font-medium">{post.stats.comments}</span>
          </Button>

          {isAuthenticated ? (
            <ShareDialog url={shareUrl}>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Share this work"
                className="h-9 rounded-none border-l border-border px-3 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Share2 className="size-4.5" />
              </Button>
            </ShareDialog>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => requestAuth("share")}
              aria-label="Share this work"
              className="h-9 rounded-none border-l border-border px-3 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Share2 className="size-4.5" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
