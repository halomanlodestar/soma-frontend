/** @format */

import { MeResponse } from "@/types/api/users";
import { CreatePostDto, FindTopPostsResponse, Post } from "@/types/api/posts";
import { FeedResponse } from "@/types/api/feed";
import { Soma } from "@/types/entities";
import { client } from "./api-client";

export const api = {
  auth: {
    me: () => client.get<MeResponse>("/api/v1/auth/me"),
  },
  posts: {
    create: (data: CreatePostDto) =>
      client.post<Post>("/api/v1/posts", { data }),
    findTop: (page = 1, limit = 20) =>
      client.get<FindTopPostsResponse>("/api/v1/posts", {
        params: { page, limit },
      }),
    getById: (id: string) => client.get<Post>(`/api/v1/posts/${id}`),
    update: (id: string, data: Partial<CreatePostDto>) =>
      client.patch<Post>(`/api/v1/posts/${id}`, { data }),
    remove: (id: string) => client.delete<void>(`/api/v1/posts/${id}`),
  },
  feed: {
    global: (page = 1, limit = 20) =>
      client.get<FeedResponse>("/api/v1/feed", { params: { page, limit } }),
    soma: (somaId: string, page = 1, limit = 20) =>
      client.get<FeedResponse>(`/api/v1/somas/${somaId}/feed`, {
        params: { page, limit },
      }),
  },
  somas: {
    list: () => client.get<Soma[]>("/api/v1/somas"),
    getBySlug: (slug: string) => client.get<Soma>(`/api/v1/somas/${slug}`),
    create: (data: Partial<Soma>) =>
      client.post<Soma>("/api/v1/somas", { data }),
  },
};
