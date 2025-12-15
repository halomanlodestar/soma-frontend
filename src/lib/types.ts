/** @format */

import { components } from "./api-types";

// --- Types ---
export type FeedItem = components["schemas"]["FeedItem"];
export type Post = components["schemas"]["Post"];
export type Comment = components["schemas"]["Comment"];
export type CreateVoteDto = components["schemas"]["CreateVoteDto"];
export type Vote = components["schemas"]["Vote"];
export type CreateAwardDto = components["schemas"]["CreateAwardDto"];
export type Award = components["schemas"]["Award"];

export type UpdateUserProfileDto =
  components["schemas"]["UpdateUserProfileDto"];
export type CreatePostDto = components["schemas"]["CreatePostDto"];
export type UpdatePostDto = components["schemas"]["UpdatePostDto"];
export type CreateSomaDto = components["schemas"]["CreateSomaDto"];
export type Soma = components["schemas"]["Soma"];
export type CreateCommentDto = components["schemas"]["CreateCommentDto"];
export type UpdateCommentDto = components["schemas"]["UpdateCommentDto"];
export type Notification = components["schemas"]["Notification"];
export type DeleteVoteDto = components["schemas"]["DeleteVoteDto"];
export type UploadIntentDto = components["schemas"]["UploadIntentDto"];
export type UploadIntentResponseDto =
  components["schemas"]["UploadIntentResponseDto"];
export type AttachMediaDto = components["schemas"]["AttachMediaDto"];
export type MediaItem = components["schemas"]["MediaItem"];
export type MediaCollection = components["schemas"]["MediaCollection"];

// Missing in OpenAPI spec, defining loosely
export type User = Record<string, unknown>;
