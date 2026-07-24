/** @format */
"use client";

import { useUser } from "@/modules/user/hooks/useUser";
import { useEffect } from "react";

export default function Page() {
  const { data: user } = useUser();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return <div>Hello, {user?.displayName}!</div>;
}
