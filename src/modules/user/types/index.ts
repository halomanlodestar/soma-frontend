export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio: string;
  isVerified: boolean;
  joinedAt: string;
  stats: {
    posts: number;
    comments: number;
    followers: number;
    following: number;
  };
  awards: string[];
}
