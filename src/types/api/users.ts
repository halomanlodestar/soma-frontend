/** @format */

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
