/** @format */

import { NextRequest, NextResponse } from "next/server";
import { authCookies, postAuth } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(authCookies.refresh)?.value;

  if (refreshToken) {
    try {
      await postAuth("/logout", { refreshToken });
    } catch {
      // Clear the browser session even if the backend is temporarily unavailable.
    }
  }

  const response = NextResponse.json({ success: true });

  response.cookies.delete(authCookies.refresh);

  return response;
}
