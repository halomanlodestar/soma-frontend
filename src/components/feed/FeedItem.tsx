/** @format */

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Trophy, MessageSquare } from "lucide-react";
import { FeedItem as FeedItemType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeedItemProps {
  post: FeedItemType;
  className?: string;
}

export function FeedItem({ post, className }: FeedItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col py-4 border-b border-border hover:bg-muted/10 transition-colors duration-200",
        className
      )}
    >
      {/* 1. Metadata Row */}
      <div className="flex items-center text-xs text-muted-foreground mb-2 px-4 space-x-2">
        <Link
          href={`/somas/${post.soma.slug}`}
          className="font-bold text-foreground hover:underline"
        >
          s/{post.soma.name}
        </Link>
        <span>•</span>
        <span className="text-muted-foreground">u/{post.author.username}</span>
        <span>•</span>
        <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
      </div>

      {/* 2. Title */}
      <Link href={`/posts/${post.id}`} className="group block mb-3 px-4">
        <h2 className="text-xl font-medium leading-normal group-hover:text-primary transition-colors">
          {post.title}
        </h2>
      </Link>

      {/* 3. Media Preview (Full Width) */}
      {post.media && post.media.items.length > 0 && (
        <div className="mb-3 w-full bg-black/5 flex justify-center items-center">
          {post.media.items[0].type === "IMAGE" && (
            <img
              src={post.media.items[0].originalUrl}
              alt={post.title}
              className="w-full h-auto max-h-[600px] object-contain"
              loading="lazy"
            />
          )}
          {post.media.items[0].type === "VIDEO" && (
            <video
              src={post.media.items[0].originalUrl}
              controls
              className="w-full h-auto max-h-[600px]"
            />
          )}
        </div>
      )}

      {/* 4. Interaction Row */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-4 mt-1">
        <div className="flex items-center gap-1.5 hover:bg-muted/50 p-1.5 px-2 rounded-full transition-colors cursor-pointer">
          <ThumbsUp className="h-4 w-4" />
          <span>{post.voteCount}</span>
        </div>

        <Link
          href={`/posts/${post.id}#comments`}
          className="flex items-center gap-1.5 hover:bg-muted/50 p-1.5 px-2 rounded-full transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comments</span>
        </Link>

        {post.awardCount > 0 && (
          <div className="flex items-center gap-1.5 hover:bg-muted/50 p-1.5 px-2 rounded-full transition-colors cursor-pointer">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{post.awardCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
