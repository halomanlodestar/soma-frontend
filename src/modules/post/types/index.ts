export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Full markdown/html content for detailed view
  mediaUrl?: string;
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
  createdAt: string;
}
