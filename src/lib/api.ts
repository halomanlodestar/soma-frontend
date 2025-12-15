/** @format */

import {
  FeedItem,
  Post,
  Comment,
  CreateVoteDto,
  Vote,
  CreateAwardDto,
  Award,
  UpdateUserProfileDto,
  CreatePostDto,
  UpdatePostDto,
  CreateSomaDto,
  Soma,
  CreateCommentDto,
  UpdateCommentDto,
  Notification,
  DeleteVoteDto,
  UploadIntentDto,
  UploadIntentResponseDto,
  AttachMediaDto,
  MediaCollection,
  User,
} from "./types";

// --- Helper ---

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

// --- API ---

export const api = {
  // --- Users ---
  getMyProfile: async (): Promise<User> => {
    return request<User>("/users/me");
  },

  updateMyProfile: async (input: UpdateUserProfileDto): Promise<User> => {
    return request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  getUserByUsername: async (username: string): Promise<User> => {
    return request<User>(`/users/${username}`);
  },

  // --- Posts ---
  getTopPosts: async (): Promise<Post[]> => {
    return request<Post[]>("/posts");
  },

  createPost: async (input: CreatePostDto): Promise<Post> => {
    return request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getPostsBySoma: async (somaId: string): Promise<Post[]> => {
    return request<Post[]>(`/somas/${somaId}/posts`);
  },

  getPostById: async (postId: string): Promise<Post> => {
    return request<Post>(`/posts/${postId}`);
  },

  deletePost: async (postId: string): Promise<void> => {
    return request<void>(`/posts/${postId}`, {
      method: "DELETE",
    });
  },

  updatePost: async (postId: string, input: UpdatePostDto): Promise<Post> => {
    return request<Post>(`/posts/${postId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  // --- Somas ---
  getAllSomas: async (): Promise<Soma[]> => {
    return request<Soma[]>("/somas");
  },

  createSoma: async (input: CreateSomaDto): Promise<Soma> => {
    return request<Soma>("/somas", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getSomaBySlug: async (slug: string): Promise<Soma> => {
    return request<Soma>(`/somas/${slug}`);
  },

  // --- Auth ---
  getCurrentUser: async (): Promise<User> => {
    return request<User>("/auth/me");
  },

  // --- Comments ---
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    return request<Comment[]>(`/posts/${postId}/comments`);
  },

  createComment: async (
    postId: string,
    input: CreateCommentDto
  ): Promise<Comment> => {
    return request<Comment>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  replyToComment: async (
    commentId: string,
    input: CreateCommentDto
  ): Promise<Comment> => {
    return request<Comment>(`/comments/${commentId}/replies`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  deleteComment: async (commentId: string): Promise<void> => {
    return request<void>(`/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  updateComment: async (
    commentId: string,
    input: UpdateCommentDto
  ): Promise<Comment> => {
    return request<Comment>(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  // --- Notifications ---
  getNotifications: async (): Promise<Notification[]> => {
    return request<Notification[]>("/notifications");
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    return request<void>(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  },

  // --- Votes ---
  createVote: async (input: CreateVoteDto): Promise<Vote> => {
    return request<Vote>("/votes", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  deleteVote: async (input: DeleteVoteDto): Promise<void> => {
    return request<void>("/votes", {
      method: "DELETE",
      body: JSON.stringify(input),
    });
  },

  // --- Media ---
  createUploadIntent: async (
    input: UploadIntentDto
  ): Promise<UploadIntentResponseDto> => {
    return request<UploadIntentResponseDto>("/media/upload-intent", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getMediaByPost: async (postId: string): Promise<MediaCollection> => {
    return request<MediaCollection>(`/posts/${postId}/media`);
  },

  attachMedia: async (
    postId: string,
    input: AttachMediaDto
  ): Promise<MediaCollection> => {
    return request<MediaCollection>(`/posts/${postId}/media`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  // --- Awards ---
  giveAward: async (input: CreateAwardDto): Promise<Award> => {
    return request<Award>("/awards", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getAwardsByPost: async (postId: string): Promise<Award[]> => {
    return request<Award[]>(`/posts/${postId}/awards`);
  },

  getAwardsByComment: async (commentId: string): Promise<Award[]> => {
    return request<Award[]>(`/comments/${commentId}/awards`);
  },

  // --- Feed ---
  getFeed: async (): Promise<FeedItem[]> => {
    return request<FeedItem[]>("/feed");
  },

  getSomaFeed: async (somaId: string): Promise<FeedItem[]> => {
    return request<FeedItem[]>(`/somas/${somaId}/feed`);
  },
};
