import { redirect } from "next/navigation";

// OAuth handoff codes are exchanged only by /api/auth/callback. Keeping this
// route prevents the legacy URL from ever accepting credentials in the browser.
export default function LegacyAuthCallbackPage() {
  redirect("/login?error=invalid_callback");
}
