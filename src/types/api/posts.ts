/** @format */

export type Post = {
  id: string;
  title: string;
  body?: string | null;
  authorId: string;
  somaId: string;
  impressions: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostDto = {
  title: string;
  body?: string | null;
  somaId: string;
  media?: unknown[];
};

export type UpdatePostDto = Partial<{
  title: string;
  body: string | null;
}>;

export type FindTopPostsResponse = {
  items: Post[];
  total: number;
};
