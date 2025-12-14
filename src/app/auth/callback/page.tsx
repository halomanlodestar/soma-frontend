/** @format */

"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("accessToken");

    if (token) {
      localStorage.setItem("accessToken", token);
      router.push("/feed");
    } else {
      // Handle error case - maybe redirect back to login
      console.error("No access token found");
      router.push("/login"); // Fallback
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Authenticating...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
}
