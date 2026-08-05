/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigDown, ArrowBigUp, BadgeCheck, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Comment } from "@/modules/comment/types";
import { useCommentActions } from "@/modules/comment/api/useCommentActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useVote } from "@/modules/post/api/useVote";
import { useAuthPrompt } from "@/components/providers/AuthPromptProvider";
import { cn } from "@/lib/utils";

const commentSchema = z.object({
  content: z.string().trim().min(2, "Write at least two characters.").max(2_000, "Keep thoughts under 2,000 characters."),
});

type CommentValues = z.infer<typeof commentSchema>;

function CommentComposer({
  label,
  onSubmit,
  onCancel,
  placeholder,
}: {
  label: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder: string;
}) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const submit = async (values: CommentValues) => {
    try {
      await onSubmit(values.content);
      reset();
      onCancel?.();
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "We could not add your thought.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-4">
      <FieldGroup>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <Field data-invalid={errors.content ? true : undefined}>
              <FieldLabel htmlFor={label} className="sr-only">
                {label}
              </FieldLabel>
              <Textarea
                id={label}
                className="min-h-24 resize-y"
                placeholder={placeholder}
                aria-invalid={errors.content ? true : undefined}
                {...field}
              />
              <FieldError errors={errors.content ? [errors.content] : undefined} />
            </Field>
          )}
        />
        <FieldError errors={errors.root ? [errors.root] : undefined} />
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isSubmitting}>
            <Send data-icon="inline-start" />
            {isSubmitting ? "Sharing…" : "Share thought"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  postId?: string;
}

function CommentItem({ comment, depth = 0, postId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { vote, removeVote } = useVote();
  const { addReply } = useCommentActions();
  const { isAuthenticated, requestAuth } = useAuthPrompt();
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const isReply = depth > 0;
  const isPending = comment.id.startsWith("client:comment:");
  const hasUpvoted = comment.userVoteValue === 1;
  const hasDownvoted = comment.userVoteValue === -1;

  const handleUpvote = () => {
    requestAuth("support", () => {
      void (hasUpvoted
        ? removeVote(comment.id, "COMMENT", 1)
        : vote(comment.id, "COMMENT", 1, comment.userVoteValue)
      ).catch(() => toast.error("We could not update that support."));
    });
  };

  const handleDownvote = () => {
    requestAuth("support", () => {
      void (hasDownvoted
        ? removeVote(comment.id, "COMMENT", -1)
        : vote(comment.id, "COMMENT", -1, comment.userVoteValue)
      ).catch(() => toast.error("We could not update that support."));
    });
  };

  const submitReply = (content: string) =>
    new Promise<void>((resolve, reject) => {
      if (!isAuthenticated) {
        requestAuth("support");
        resolve();
        return;
      }

      requestAuth("support", () => {
        if (!postId) {
          resolve();
          return;
        }

        void addReply(postId, comment.id, content)
          .then(() => resolve())
          .catch(reject);
      });
    });

  return (
    <div className={cn("flex gap-3", isReply ? "mt-4" : "mt-6")}>
      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-8 shrink-0 ring-1 ring-border">
          <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
          <AvatarFallback className="text-xs">
            {comment.author.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {comment.replies && comment.replies.length > 0 && (
          <div className="my-1 h-full w-px rounded-full bg-border" />
        )}
      </div>

      <div className="flex w-full flex-col">
        <div className="flex items-center gap-2 text-xs">
          <Link href={`/u/${comment.author.username}`} className="flex items-center gap-1 font-semibold text-foreground hover:text-primary hover:underline">
            {comment.author.name}
            {comment.author.isVerified && <BadgeCheck className="size-3.5 text-primary" aria-label="Verified creator" />}
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{timeAgo}</span>
        </div>
        <p className="mt-1.5 pr-4 text-sm leading-relaxed text-foreground/90">{comment.content}</p>

        <div className="-ml-2 mt-2 flex items-center gap-1 text-muted-foreground">
          <Button variant="ghost" size="icon-xs" onClick={handleUpvote} aria-label={hasUpvoted ? "Remove support" : "Support thought"} className={cn("hover:text-primary", hasUpvoted && "bg-primary/10 text-primary")}>
            <ArrowBigUp className={cn(hasUpvoted && "fill-current")} />
          </Button>
          <span className={cn("px-1 text-xs font-semibold", hasUpvoted ? "text-primary" : hasDownvoted ? "text-destructive" : "text-foreground")}>
            {comment.stats.upvotes}
          </span>
          <Button variant="ghost" size="icon-xs" onClick={handleDownvote} aria-label={hasDownvoted ? "Remove downvote" : "Downvote thought"} className={cn("hover:text-destructive", hasDownvoted && "bg-destructive/10 text-destructive")}>
            <ArrowBigDown className={cn(hasDownvoted && "fill-current")} />
          </Button>
          {postId && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              disabled={isPending}
              onClick={() => setIsReplying((value) => !value)}
            >
              <MessageSquare data-icon="inline-start" />
              {isPending ? "Posting…" : "Reply"}
            </Button>
          )}
        </div>

        {isReplying && (
          <CommentComposer
            label={`reply-${comment.id}`}
            placeholder={`Reply to ${comment.author.name}`}
            onSubmit={submitReply}
            onCancel={() => setIsReplying(false)}
          />
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} postId={postId} />
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
  postId?: string;
}

export function CommentTree({ comments, isLoading, postId }: CommentTreeProps) {
  const { addComment } = useCommentActions();
  const { isAuthenticated, requestAuth } = useAuthPrompt();

  const submitComment = (content: string) =>
    new Promise<void>((resolve, reject) => {
      if (!postId) {
        resolve();
        return;
      }

      if (!isAuthenticated) {
        requestAuth("support");
        resolve();
        return;
      }

      requestAuth("support", () => {
        void addComment(postId, content)
          .then(() => resolve())
          .catch(reject);
      });
    });

  if (isLoading) {
    return <div className="py-8 text-sm text-muted-foreground">Loading thoughts…</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col py-4">
      <h3 className="font-heading text-lg font-bold">Thoughts &amp; feedback</h3>
      {postId && (
        <CommentComposer
          label="new-comment"
          placeholder="Add something considered, specific, or useful…"
          onSubmit={submitComment}
        />
      )}
      {!comments || comments.length === 0 ? (
        <p className="py-8 text-sm text-muted-foreground">No thoughts shared yet. Be the first.</p>
      ) : (
        <div className="flex flex-col">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
