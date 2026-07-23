/** @format */

"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { loginWithGoogle, isLoading, error } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Column: Art Showcase / Collage (Hidden on smaller screens) */}
      <div className="relative hidden lg:flex h-full w-full items-center justify-center bg-zinc-950 p-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000&auto=format&fit=crop" 
            fill 
            className="object-cover blur-2xl" 
            alt="background blur" 
          />
        </div>
        
        {/* Collage Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-lg rotate-[-4deg] scale-105 opacity-90 transition-all duration-1000 hover:rotate-0 hover:scale-100 hover:opacity-100">
          
          <div className="flex flex-col gap-4 mt-12">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-110" 
                alt="Artwork 1" 
                priority
              />
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-110" 
                alt="Artwork 2" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 -mt-12">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-110" 
                alt="Artwork 3" 
                priority
              />
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=800&auto=format&fit=crop" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-110" 
                alt="Artwork 4" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-12 h-full">
        {/* Subtle radial gradients for the form background */}
        <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="z-10 w-full max-w-sm flex flex-col items-center gap-10">
          
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground">
              Soma
            </h1>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              art, where it should belong
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive text-center">
                {error}
              </div>
            )}

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={loginWithGoogle}
              className="h-12 w-full justify-center gap-3 font-medium text-base shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <GoogleIcon className="size-5" />
              <span>Continue with Google</span>
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
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
