/** @format */

import { NextRequest, NextResponse } from "next/server";
import {
  authCookies,
  cookieOptions,
  postAuth,
  type TokenResponse,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const handoffCode = request.nextUrl.searchParams.get("code");

  if (!handoffCode) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_callback", request.url),
    );
  }

  try {
    const upstream = await postAuth("/exchange", { handoffCode });

    if (!upstream.ok) {
      return NextResponse.redirect(
        new URL("/login?error=sign_in_failed", request.url),
      );
    }

    const tokens = (await upstream.json()) as TokenResponse;
    const response = NextResponse.redirect(
      new URL("/auth/callback", request.url),
    );

    response.cookies.set(
      authCookies.refresh,
      tokens.refreshToken,
      cookieOptions(60 * 60 * 24 * 30),
    );

    return response;
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=sign_in_failed", request.url),
    );
  }
}
