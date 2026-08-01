"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/apollo-provider";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    void getAccessToken().then((token) => {
      router.replace(token ? "/" : "/login?error=sign_in_failed");
    });
  }, [router]);

  return null;
}
