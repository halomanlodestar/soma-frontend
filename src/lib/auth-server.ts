import "server-only";

const REFRESH_COOKIE = "soma-refresh";

export const authCookies = {
  refresh: REFRESH_COOKIE,
};

export function getApiUrl() {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API_URL must be configured for authentication.");
  }

  return apiUrl.replace(/\/$/, "");
}

export type TokenResponse = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    role: "VIEWER" | "CREATOR" | "ADMIN";
  };
};

export async function postAuth<T>(path: string, body: unknown): Promise<Response> {
  return fetch(`${getApiUrl()}/api/v1/auth${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
