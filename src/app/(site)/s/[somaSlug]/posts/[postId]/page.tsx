/** @format */

"use client";

import { use, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowLeft,
  BadgeCheck,
  MessageCircle,
  Share2,
} from "lucide-react";

import { useGetPostById } from "@/modules/post/api/useGetPostById";
import { useGetPostAttachments } from "@/modules/post/api/useGetPostAttachments";
import { useVote } from "@/modules/post/api/useVote";
import { PostAttachments } from "@/modules/post/components/PostAttachments";
import { useGetComments } from "@/modules/comment/api/useGetComments";
import { CommentTree } from "@/modules/comment/components/CommentTree";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareDialog } from "@/components/common/ShareDialog";
import { ReportEntryPoint } from "@/components/common/ReportEntryPoint";
import { useAuthPrompt } from "@/components/providers/AuthPromptProvider";
import { absoluteUrl } from "@/lib/metadata";

interface PostPageProps {
  params: Promise<{ somaSlug: string; postId: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const { somaSlug, postId } = use(params);
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
    isNotFound,
  } = useGetPostById(postId);
  const { data: postAttachments } = useGetPostAttachments(postId);
  const {
    data: comments,
    isLoading: commentsLoading,
  } = useGetComments(postId);
  const { vote, removeVote } = useVote();
  const { isAuthenticated, requestAuth } = useAuthPrompt();
  const [isUpvoteConfirming, setIsUpvoteConfirming] = useState(false);

  if (postLoading) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Skeleton className="mb-10 h-4 w-36" />
          <div className="flex max-w-3xl flex-col gap-5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-12 w-4/5 sm:h-16" />
            <Skeleton className="h-10 w-52" />
          </div>
          <Skeleton className="mt-10 aspect-4/3 w-full rounded-xl bg-muted sm:aspect-video" />
          <div className="mt-10 flex max-w-2xl flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </main>
    );
  }

  if (isNotFound) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Work unavailable
          </p>
          <h1 className="mt-3 font-heading text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">
            This post could not be found.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            It may have been removed, or the link may be incorrect.
          </p>
          <Button asChild className="mt-7">
            <Link href={`/s/${somaSlug}`}>Back to s/{somaSlug}</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (postError || !post) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Unable to load work
          </p>
          <h1 className="mt-3 font-heading text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">
            We could not load this post.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Please try again, or return to the Soma.
          </p>
          <Button asChild className="mt-7">
            <Link href={`/s/${somaSlug}`}>Back to s/{somaSlug}</Link>
          </Button>
        </div>
      </main>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const shareUrl = absoluteUrl(`/s/${post.soma.slug}/posts/${post.id}`);
  const hasUpvoted = post.userVoteValue === 1;
  const hasDownvoted = post.userVoteValue === -1;

  const handleUpvote = () => {
    requestAuth("support", () => {
      if (hasUpvoted) {
        removeVote(post.id, "POST", 1);
        return;
      }

      vote(post.id, "POST", 1, post.userVoteValue);
      setIsUpvoteConfirming(true);
      window.setTimeout(() => setIsUpvoteConfirming(false), 360);
    });
  };

  const handleDownvote = () => {
    requestAuth("support", () => {
      if (hasDownvoted) {
        removeVote(post.id, "POST", -1);
        return;
      }

      vote(post.id, "POST", -1, post.userVoteValue);
    });
  };

  const scrollToThoughts = () => {
    document.getElementById("thoughts")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href={`/s/${somaSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to s/{post.soma.slug}
        </Link>

        <article className="pt-8 sm:pt-10">
          <header className="max-w-3xl">
            <Link
              href={`/s/${post.soma.slug}`}
              className="text-xs font-medium uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground"
            >
              s/{post.soma.slug}
            </Link>
            <h1 className="mt-3 font-heading text-3xl font-medium leading-[1.12] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <Link
              href={`/u/${post.author.username}`}
              className="group mt-6 inline-flex items-center gap-3"
            >
              <Avatar className="size-10 ring-1 ring-border transition-colors group-hover:ring-primary/50">
                <AvatarImage
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                />
                <AvatarFallback>
                  {post.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {post.author.name}
                  {post.author.isVerified && (
                    <BadgeCheck
                      className="size-4 text-primary"
                      aria-label="Verified creator"
                    />
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </span>
            </Link>
          </header>

          <div className="mt-10">
            <PostAttachments
              attachments={
                postAttachments.length
                  ? postAttachments
                  : post.mediaUrl
                    ? [{ originalUrl: post.mediaUrl, type: "image" }]
                    : []
              }
              postTitle={post.title}
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
            <div className="max-w-2xl whitespace-pre-wrap text-[0.9375rem] leading-7 text-foreground sm:text-base sm:leading-8">
              {post.content || post.excerpt}
            </div>

            <aside className="flex h-fit items-center gap-2 border-y border-border py-3 lg:sticky lg:top-24 lg:flex-col lg:items-stretch lg:border-y-0 lg:border-l lg:py-0 lg:pl-6">
              <div className="flex items-center overflow-hidden rounded-lg border border-border bg-muted/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpvote}
                  aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
                  className={`h-8 rounded-none px-2.5 hover:bg-accent ${hasUpvoted ? "bg-accent text-primary" : "text-muted-foreground"} ${isUpvoteConfirming ? "motion-safe:animate-[soma-vote-pop_360ms_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
                >
                  <ArrowBigUp
                    className={`size-4 transition-transform duration-200 ${hasUpvoted ? "fill-current" : ""} ${isUpvoteConfirming ? "scale-110" : ""}`}
                  />
                </Button>
                <span
                  className={`px-2 text-xs font-medium tabular-nums ${hasUpvoted ? "text-primary" : hasDownvoted ? "text-destructive" : "text-foreground"}`}
                >
                  {post.stats.upvotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownvote}
                  aria-label={hasDownvoted ? "Remove downvote" : "Downvote"}
                  className={`h-8 rounded-none px-2.5 hover:bg-destructive/10 ${hasDownvoted ? "bg-destructive/10 text-destructive" : "text-muted-foreground"}`}
                >
                  <ArrowBigDown
                    className={`size-4 ${hasDownvoted ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToThoughts}
                className="h-8 gap-2 px-3 text-muted-foreground hover:bg-accent/30 hover:text-foreground lg:justify-start"
              >
                <MessageCircle data-icon="inline-start" />
                <span>{post.stats.comments} thoughts</span>
              </Button>

              {isAuthenticated ? (
                <ShareDialog url={shareUrl}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-3 text-muted-foreground hover:bg-accent/30 hover:text-foreground lg:justify-start"
                  >
                    <Share2 data-icon="inline-start" />
                    <span>Share</span>
                  </Button>
                </ShareDialog>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => requestAuth("share")}
                  className="h-8 gap-2 px-3 text-muted-foreground hover:bg-accent/30 hover:text-foreground lg:justify-start"
                >
                  <Share2 data-icon="inline-start" />
                  <span>Share</span>
                </Button>
              )}

              <ReportEntryPoint
                subject="work"
                label={post.title}
                className="h-8 gap-2 px-3 text-muted-foreground hover:bg-accent/30 hover:text-foreground lg:justify-start"
              />
            </aside>
          </div>

          <section
            id="thoughts"
            className="mt-16 max-w-3xl border-t border-border pt-8 sm:mt-20 sm:pt-10"
          >
            <CommentTree
              comments={comments}
              isLoading={commentsLoading}
              postId={postId}
            />
          </section>
        </article>
      </div>
    </main>
  );
}
