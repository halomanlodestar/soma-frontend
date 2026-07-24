/** @format */

"use client";

import { use } from "react";
import { useGetPostById } from "@/modules/post/api/useGetPostById";
import { useGetComments } from "@/modules/comment/api/useGetComments";
import { PostDetailContent } from "@/modules/post/components/PostDetailContent";
import { CommentTree } from "@/modules/comment/components/CommentTree";

interface PostPageProps {
  params: Promise<{ somaSlug: string; postId: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  // Unwrap params using React 19 `use`
  const { postId } = use(params);

  // Fetch data
  const { data: post, isLoading: postLoading } = useGetPostById(postId);
  const { data: comments, isLoading: commentsLoading } = useGetComments(postId);

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 sm:px-6 lg:px-8 pb-20">
      <div className="mx-auto w-full max-w-4xl pt-8 pb-12">
        {/* The Main Post Content */}
        <PostDetailContent post={post} isLoading={postLoading} />
        
        {/* The Discussion Thread */}
        <div className="mt-8">
          <CommentTree comments={comments} isLoading={commentsLoading} />
        </div>
      </div>
    </div>
  );
}
