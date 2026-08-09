/** @format */

export interface MediaMetadata {
  width?: number | null;
  height?: number | null;
}

export interface PostAttachment {
  originalUrl: string;
  type: string;
  metadata?: MediaMetadata | null;
}

export type CreatePostInput = {
  body: string;
  file: File;
  somaId: string;
  title: string;
};

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Full markdown/html content for detailed view
  mediaUrl?: string;
  attachments?: PostAttachment[];
  author: {
    name: string;
    username: string;
    avatarUrl?: string;
    isVerified: boolean;
    bio: string;
    stats: {
      posts: number;
      comments: number;
    };
    awards: string[];
  };
  soma: {
    name: string;
    slug: string;
  };
  stats: {
    upvotes: number;
    comments: number;
  };
  userVoteValue?: number | null;
  createdAt: string;
}
