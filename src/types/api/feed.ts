/** @format */

import { Post } from "../api/posts";

export type FeedItem = {
  post: Post;
  author: {
    id: string;
    username: string;
    displayName?: string | null;
  };
  soma: {
    id: string;
    slug: string;
    name: string;
  };
  awardCount: number;
};

export type FeedResponse = {
  items: FeedItem[];
  total: number;
};
