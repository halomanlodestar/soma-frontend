/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export function LoginLayout() {
  const { loginWithGoogle, isLoading, error } = useAuth();

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-primary px-10 py-12 text-primary-foreground lg:flex lg:flex-col xl:px-16">
        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-2 text-sm transition-opacity hover:opacity-75"
        >
          <ArrowLeft className="size-4" />
          Back to Soma
        </Link>

        <div className="relative z-10 my-auto max-w-md">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] opacity-75">
            A quieter internet
          </p>
          <h1 className="font-heading text-4xl font-medium leading-[1.08] tracking-[-0.045em] xl:text-5xl">
            Make room for the work that moves you.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 opacity-80">
            Soma is a home for people who still want to make, notice, and share with care.
          </p>
        </div>

        <div className="relative z-10 mt-10 h-92 xl:h-104">
          <figure className="absolute bottom-0 left-[5%] h-60 w-44 -rotate-6 overflow-hidden rounded-sm border border-primary-foreground/25 bg-background p-1.5 shadow-[0_18px_36px_rgb(0_0_0/0.18)] xl:h-72 xl:w-52">
            <div className="relative h-full w-full overflow-hidden bg-secondary">
              <Image
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
                alt="Abstract painted artwork"
                fill
                className="object-cover"
                priority
              />
            </div>
          </figure>
          <figure className="absolute right-[3%] top-0 h-64 w-48 rotate-5 overflow-hidden rounded-sm border border-primary-foreground/25 bg-background p-1.5 shadow-[0_18px_36px_rgb(0_0_0/0.18)] xl:h-76 xl:w-56">
            <div className="relative h-full w-full overflow-hidden bg-secondary">
              <Image
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop"
                alt="Artist at work"
                fill
                className="object-cover"
              />
            </div>
          </figure>
          <div className="absolute bottom-12 left-[43%] flex size-16 -rotate-12 items-center justify-center rounded-full border border-primary-foreground/25 bg-primary-foreground text-primary shadow-[0_12px_24px_rgb(0_0_0/0.16)] xl:size-20">
            <ArrowUpRight className="size-6 xl:size-7" />
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col px-5 py-6 sm:px-10 sm:py-10 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-2xl font-medium tracking-[-0.04em] text-foreground"
          >
            Soma
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm py-16 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Welcome in</p>
          <h2 className="mt-3 font-heading text-3xl font-medium leading-[1.12] tracking-[-0.04em] text-foreground sm:text-4xl">
            Pick up where curiosity left off.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Sign in to follow the makers you care about and keep a quieter collection of work worth returning to.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {error && (
              <p role="alert" className="border-l-2 border-destructive px-3 py-2 text-sm leading-6 text-destructive">
                {error}
              </p>
            )}

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={loginWithGoogle}
              className="h-12 w-full justify-center gap-3 text-base"
            >
              <GoogleIcon data-icon="inline-start" />
              {isLoading ? "Opening Google…" : "Continue with Google"}
            </Button>
          </div>

          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            By continuing, you agree to take part in a space built around care, credit, and human intention.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Quality over quantity, always.
        </p>
      </section>
    </main>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
