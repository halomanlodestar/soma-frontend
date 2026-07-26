export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    username: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  stats: {
    upvotes: number;
  };
  userVoteValue?: number | null;
  createdAt: string;
  replies?: Comment[];
}
