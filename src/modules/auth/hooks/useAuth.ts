/** @format */

"use client";

import { useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isCreator: boolean;
  creatorBadge?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const loginWithGoogle = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
      window.location.href = `${apiUrl}/api/v1/auth/google`;
    } catch {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to initiate Google sign-in",
      }));
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    loginWithGoogle,
    logout,
  };
};
