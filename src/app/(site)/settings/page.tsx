/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut, ShieldCheck, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useGetMe } from "@/modules/user/api/useGetMe";

const settingsSections = [
  {
    href: "/settings/profile",
    icon: UserRound,
    title: "Public profile",
    description: "Your name, bio, and the profile people see across Soma.",
  },
  {
    href: "/settings/security",
    icon: ShieldCheck,
    title: "Account & security",
    description: "Review where you are signed in and manage active sessions.",
  },
];

export default function SettingsPage() {
  const { me, isLoading } = useGetMe();
  const { logout } = useAuth();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const name = me?.displayName || me?.username || "Your account";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.replace("/");
    router.refresh();
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="border-b border-border pb-8 sm:pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">Settings</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Manage your account and the public presence attached to your work.
        </p>
      </header>

      <section aria-label="Your account" className="py-8 sm:py-10">
        {isLoading ? (
          <div className="flex items-center gap-3"><Skeleton className="size-11 rounded-full" /><div className="flex flex-col gap-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-44" /></div></div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border border-border bg-muted">
              <AvatarImage src={me?.avatarUrl || undefined} alt={name} className="object-cover" />
              <AvatarFallback className="font-medium">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{name}</p>
              <p className="truncate text-sm text-muted-foreground">{me?.email || "Account details"}</p>
            </div>
          </div>
        )}
      </section>

      <nav aria-label="Account settings" className="border-y border-border">
        {settingsSections.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group flex items-center gap-4 py-5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Icon className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1"><span className="block font-medium text-foreground">{title}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span></span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <div className="mt-12 border-t border-border pt-6">
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setLogoutOpen(true)} disabled={!me}>
          <LogOut data-icon="inline-start" />
          Log out
        </Button>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-sm" showCloseButton={!isLoggingOut}>
          <DialogHeader className="border-b border-border px-6 pt-6 pb-5">
            <DialogTitle className="text-xl tracking-[-0.025em]">Log out of Soma?</DialogTitle>
            <DialogDescription className="mt-2 text-sm">
              You will need to sign in again to share work or manage your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-6 py-5">
            <Button variant="outline" onClick={() => setLogoutOpen(false)} disabled={isLoggingOut}>Cancel</Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut data-icon="inline-start" />
              {isLoggingOut ? "Logging out…" : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
