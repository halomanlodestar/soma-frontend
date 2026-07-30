/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { useGetMe } from "@/modules/user/api/useGetMe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthAction = "support" | "follow" | "share";

const promptCopy: Record<
  AuthAction,
  { eyebrow: string; title: string; description: string; cta: string }
> = {
  support: {
    eyebrow: "Support the work",
    title: "Want to support your favourite creator?",
    description:
      "A small signal helps thoughtful work find the people who will truly spend time with it.",
    cta: "Sign in to support",
  },
  follow: {
    eyebrow: "Stay in tune",
    title: "Want to stay tuned in with this creator?",
    description:
      "Sign in to follow their work and return to the ideas, images, and process you want to keep close.",
    cta: "Sign in to follow",
  },
  share: {
    eyebrow: "Pass it on",
    title: "Want to share work worth keeping?",
    description:
      "Sign in to share art with care—and, when you are ready, add your own work to the conversation.",
    cta: "Sign in to Soma",
  },
};

interface AuthPromptContextValue {
  isAuthenticated: boolean;
  requestAuth: (action: AuthAction, onAuthenticated?: () => void) => void;
}

const AuthPromptContext = createContext<AuthPromptContextValue | null>(null);

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const { me, isLoading } = useGetMe();
  const [action, setAction] = useState<AuthAction | null>(null);
  const [displayAction, setDisplayAction] = useState<AuthAction>("support");

  const requestAuth = useCallback(
    (nextAction: AuthAction, onAuthenticated?: () => void) => {
      if (me) {
        onAuthenticated?.();
        return;
      }

      if (!isLoading) {
        setDisplayAction(nextAction);
        setAction(nextAction);
      }
    },
    [isLoading, me],
  );

  const content = promptCopy[displayAction];

  return (
    <AuthPromptContext.Provider
      value={{ isAuthenticated: Boolean(me), requestAuth }}
    >
      {children}
      <Dialog open={action !== null} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg" showCloseButton={false}>
            <div className="grid sm:grid-cols-[11rem_minmax(0,1fr)]">
              <div className="relative min-h-40 overflow-hidden bg-primary p-5 text-primary-foreground sm:min-h-full">
                <p className="relative z-10 max-w-24 font-heading text-xl font-medium leading-tight tracking-[-0.04em]">
                  A little more room for art.
                </p>
                <figure className="absolute -bottom-7 -right-7 h-34 w-26 rotate-8 overflow-hidden rounded-sm border border-primary-foreground/30 bg-background p-1 shadow-[0_12px_24px_rgb(0_0_0/0.18)]">
                  <div className="relative h-full w-full overflow-hidden bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
                      alt="Abstract painted artwork"
                      fill
                      className="object-cover"
                    />
                  </div>
                </figure>
              </div>

              <div className="flex flex-col gap-5 p-6 sm:p-7">
                <DialogHeader className="gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {content.eyebrow}
                  </p>
                  <DialogTitle className="text-2xl leading-[1.15] tracking-[-0.035em]">
                    {content.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-6">
                    {content.description}
                  </DialogDescription>
                </DialogHeader>

                <Button asChild className="w-full">
                  <Link href="/login" onClick={() => setAction(null)}>
                    {content.cta}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={() => setAction(null)}
                  className="w-fit text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Not right now
                </button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt() {
  const context = useContext(AuthPromptContext);

  if (!context) {
    throw new Error("useAuthPrompt must be used within AuthPromptProvider");
  }

  return context;
}
