/** @format */

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, BadgeCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Post } from "@/modules/post/api/useGetPosts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="w-full overflow-hidden border-border/40 bg-card transition-colors hover:bg-accent/5">
      <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-sm">
          <Avatar className="size-9 ring-1 ring-border">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">
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
              <span className="font-medium hover:text-foreground transition-colors cursor-pointer">
                s/{post.soma.slug}
              </span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Content (Title is dominant) */}
        <div className="flex flex-col gap-2.5 cursor-pointer group">
          <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Media Preview (if exists) */}
        {post.mediaUrl && (
          <div className="relative w-full overflow-hidden rounded-xl bg-muted aspect-video cursor-pointer">
            <Image
              src={post.mediaUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Interaction Row (Visually quiet) */}
        <div className="flex items-center gap-1 pt-1 -ml-2 text-muted-foreground">
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

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 ml-auto hover:text-foreground"
          >
            <Share2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
