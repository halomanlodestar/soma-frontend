/** @format */

"use client";

import { use } from "react";
import { Bookmark } from "lucide-react";
import { useGetUserByUsername } from "@/modules/user/api/useGetUserByUsername";
import { useGetPostsByUser } from "@/modules/post/api/useGetPostsByUser";
import { useGetCommentsByUser } from "@/modules/comment/api/useGetCommentsByUser";

import { UserHeader } from "@/modules/user/components/UserHeader";
import { PostCard } from "@/components/common/PostCard";
import { CommentTree } from "@/modules/comment/components/CommentTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserPageProps) {
  const { username } = use(params);

  const { data: user, isLoading: userLoading } = useGetUserByUsername(username);
  const { data: posts, isLoading: postsLoading } = useGetPostsByUser(user?.id);
  const { data: comments, isLoading: commentsLoading } = useGetCommentsByUser(
    user?.id,
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <UserHeader user={user} isLoading={userLoading} />

      <main className="mx-auto mt-8 w-full max-w-7xl px-4 sm:mt-10 sm:px-6 lg:px-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList variant="pill" className="mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="saved">Saved art</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent
            value="posts"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="max-w-3xl">
              {postsLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <article
                      key={i}
                      className="flex flex-col gap-4 border-b border-border py-8 first:pt-0 sm:gap-5"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                      </div>
                      <Skeleton className="mt-2 h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-2 aspect-video w-full rounded-xl" />
                    </article>
                  ))
                : posts?.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent
            value="comments"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="max-w-3xl border-t border-border pt-2">
              <CommentTree comments={comments} isLoading={commentsLoading} />
            </div>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent
            value="saved"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="flex max-w-xl flex-col items-start border-y border-border py-16 text-left">
              <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-accent">
                <Bookmark className="size-5 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-medium tracking-[-0.03em]">No saved art</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Only {user?.name || "this user"} can see what they have saved.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
