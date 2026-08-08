/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Laptop, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountSessions } from "@/modules/user/api/useAccountSessions";

export default function SecuritySettingsPage() {
  const { sessions, isLoading, error, revokeSession, revokeAllSessions, isRevokingSession, isRevokingAll } = useAccountSessions();
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);

  const handleRevoke = async () => {
    if (!sessionToRevoke) return;
    try { await revokeSession(sessionToRevoke); toast.success("Session signed out."); setSessionToRevoke(null); } catch (reason) { toast.error(reason instanceof Error ? reason.message : "We could not sign out that session."); }
  };
  const handleRevokeAll = async () => {
    try { await revokeAllSessions(); toast.success("All sessions have been signed out."); setConfirmAll(false); } catch { toast.error("We could not sign out all sessions."); }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-4" aria-hidden="true" />Settings</Link>
      <header className="mt-8 border-b border-border pb-8 sm:mt-10 sm:pb-10"><div className="flex items-start gap-3"><ShieldCheck className="mt-1 size-5 text-muted-foreground" aria-hidden="true" /><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Account & security</p><h1 className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">Active sessions</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Review the devices that are signed in to your account.</p></div></div></header>
      <section className="py-10 sm:py-12" aria-label="Active sessions">
        {isLoading ? <div className="flex flex-col gap-4">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-20 w-full" />)}</div> : error ? <p className="border-y border-border py-8 text-sm leading-6 text-muted-foreground">We could not load your active sessions. Please try again.</p> : sessions.length === 0 ? <p className="border-y border-border py-8 text-sm leading-6 text-muted-foreground">There are no active sessions to show.</p> : <div className="border-y border-border">{sessions.map((session) => <div key={session.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><Laptop className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" /><div className="min-w-0"><p className="font-medium text-foreground">{session.deviceName || session.clientType}</p><p className="mt-1 truncate text-sm text-muted-foreground">{session.userAgent || "Unknown browser"}</p><p className="mt-1 text-xs text-muted-foreground">Last used {formatDistanceToNow(new Date(session.lastUsedAt), { addSuffix: true })}</p></div></div><Button variant="outline" size="sm" onClick={() => setSessionToRevoke(session.id)} disabled={isRevokingSession}><LogOut data-icon="inline-start" />Sign out</Button></div>)}</div>}
        {sessions.length > 1 && <Button variant="destructive" className="mt-8" onClick={() => setConfirmAll(true)} disabled={isRevokingAll}><LogOut data-icon="inline-start" />Sign out of all sessions</Button>}
      </section>
      <Dialog open={Boolean(sessionToRevoke)} onOpenChange={(open) => !open && setSessionToRevoke(null)}><DialogContent><DialogHeader><DialogTitle>Sign out this session?</DialogTitle><DialogDescription>This device will need to sign in again to access your account.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setSessionToRevoke(null)}>Cancel</Button><Button variant="destructive" onClick={handleRevoke} disabled={isRevokingSession}>Sign out</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={confirmAll} onOpenChange={setConfirmAll}><DialogContent><DialogHeader><DialogTitle>Sign out everywhere?</DialogTitle><DialogDescription>You will need to sign in again on every device, including this one.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirmAll(false)}>Cancel</Button><Button variant="destructive" onClick={handleRevokeAll} disabled={isRevokingAll}>Sign out everywhere</Button></DialogFooter></DialogContent></Dialog>
    </main>
  );
}
