/** @format */

"use client";

import React from "react";
import { Check, Copy, Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareDialogProps {
  children: React.ReactNode;
  url: string;
}

export function ShareDialog({ children, url }: ShareDialogProps) {
  const [copied, setCopied] = React.useState(false);
  const encodedUrl = encodeURIComponent(url);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border bg-secondary px-6 pt-7 pb-6 sm:px-8">
          <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Send className="size-[1.125rem]" />
          </div>
          <DialogTitle className="font-heading text-2xl font-medium tracking-[-0.025em]">
            Pass the work along
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-sm text-sm leading-6">
            Give a piece that stayed with you another place to be seen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Direct link
            </p>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <div className="min-w-0 flex-1 truncate border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                {url}
              </div>
              <Button type="button" onClick={handleCopyLink} className="w-auto px-4">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy link"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Share elsewhere
            </p>
            <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] overflow-hidden rounded-lg border border-border">
              <Button variant="ghost" className="h-10 min-w-0 w-full overflow-hidden rounded-none px-2 text-sm" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  X
                </a>
              </Button>
              <Button variant="ghost" className="h-10 min-w-0 w-full overflow-hidden rounded-none border-x border-border px-2 text-sm" asChild>
                <a href={`mailto:?body=${encodedUrl}`}>
                  <Mail className="size-4" />
                  Email
                </a>
              </Button>
              <Button variant="ghost" className="h-10 min-w-0 w-full overflow-hidden rounded-none px-2 text-sm" asChild>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
