/** @format */

import { NextRequest, NextResponse } from "next/server";
import {
  authCookies,
  cookieOptions,
  postAuth,
  type TokenResponse,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

function clearSession(response: NextResponse) {
  response.cookies.delete(authCookies.refresh);

  return response;
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(authCookies.refresh)?.value;

  if (!refreshToken)
    return clearSession(
      NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
    );

  try {
    const upstream = await postAuth("/refresh", { refreshToken });

    if (!upstream.ok)
      return clearSession(
        NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
      );

    const tokens = (await upstream.json()) as TokenResponse;
    const response = NextResponse.json(
      {
        accessToken: tokens.accessToken,
        accessTokenExpiresIn: tokens.accessTokenExpiresIn,
        user: tokens.user,
      },
      { headers: { "cache-control": "no-store" } },
    );

    response.cookies.set(
      authCookies.refresh,
      tokens.refreshToken,
      cookieOptions(60 * 60 * 24 * 30),
    );

    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 503 },
    );
  }
}
