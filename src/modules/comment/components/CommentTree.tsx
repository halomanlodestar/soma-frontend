import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigUp, ArrowBigDown, MessageSquare, BadgeCheck } from "lucide-react";

import { Comment } from "@/modules/comment/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const isReply = depth > 0;

  return (
    <div className={`flex gap-3 ${isReply ? 'mt-4' : 'mt-6'}`}>
      
      {/* Avatar column with vertical thread line */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-8 ring-1 ring-border shrink-0">
          <AvatarImage src={comment.author.avatarUrl} />
          <AvatarFallback className="text-xs">{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {comment.replies && comment.replies.length > 0 && (
          <div className="w-[1.5px] h-full bg-border/40 rounded-full my-1" />
        )}
      </div>

      <div className="flex flex-col w-full">
        {/* Comment Header */}
        <div className="flex items-center gap-2 text-xs">
          <Link href={`/u/${comment.author.username}`} className="font-semibold text-foreground flex items-center gap-1 hover:text-primary hover:underline">
            {comment.author.name}
            {comment.author.isVerified && <BadgeCheck className="size-3.5 text-primary" />}
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{timeAgo}</span>
        </div>

        {/* Comment Body */}
        <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed pr-4">
          {comment.content}
        </p>

        {/* Action Row */}
        <div className="flex items-center gap-1 mt-2 -ml-2 text-muted-foreground">
          <Button variant="ghost" size="icon" className="size-7 hover:text-primary hover:bg-primary/10">
            <ArrowBigUp className="size-4" />
          </Button>
          <span className="text-xs font-semibold px-1">{comment.stats.upvotes}</span>
          <Button variant="ghost" size="icon" className="size-7 hover:text-destructive hover:bg-destructive/10">
            <ArrowBigDown className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 ml-2 text-xs gap-1.5">
            <MessageSquare className="size-3.5" />
            Reply
          </Button>
        </div>

        {/* Recursive Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentTreeProps {
  comments: Comment[] | null;
  isLoading: boolean;
}

export function CommentTree({ comments, isLoading }: CommentTreeProps) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-8">Loading thoughts...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-sm text-muted-foreground py-8">No thoughts shared yet. Be the first.</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-4">
      <h3 className="font-heading text-lg font-bold mb-4">Thoughts & Feedback</h3>
      <div className="flex flex-col">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
