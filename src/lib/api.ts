/** @format */

import { components } from "./api-types";

type FeedItem = components["schemas"]["FeedItem"];
type Post = components["schemas"]["Post"];
type Comment = components["schemas"]["Comment"];
type CreateVoteDto = components["schemas"]["CreateVoteDto"];
type Vote = components["schemas"]["Vote"];
type CreateAwardDto = components["schemas"]["CreateAwardDto"];
type Award = components["schemas"]["Award"];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getFeed: async (): Promise<FeedItem[]> => {
    return request<FeedItem[]>("/feed");
  },

  getPostById: async (postId: string): Promise<Post> => {
    return request<Post>(`/posts/${postId}`);
  },

  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    return request<Comment[]>(`/posts/${postId}/comments`);
  },

  createVote: async (input: CreateVoteDto): Promise<Vote> => {
    return request<Vote>("/votes", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  giveAward: async (input: CreateAwardDto): Promise<Award> => {
    return request<Award>("/awards", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
