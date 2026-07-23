/** @format */

export type User = {
  id: string;
  username: string;
  displayName?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserProfileDto = Partial<{
  displayName: string | null;
}>;
/** @format */

enum UserRole {
  VIEWER = "VIEWER",
  CREATOR = "CREATOR",
  ADMIN = "ADMIN",
  SUDO = "SUDO",
}

export interface MeResponse {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
}
