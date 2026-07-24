/** @format */

import React from "react";
import { Link2 } from "lucide-react";
import {
  TwitterLogo,
  InstagramLogo,
  FacebookLogo,
} from "@phosphor-icons/react";
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
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    // Could trigger a toast here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to</DialogTitle>
          <DialogDescription>
            Share this piece of art with your network.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-6 py-6">
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full hover:bg-sky-500/10 hover:text-sky-500 hover:border-sky-500/30 transition-colors"
          >
            <TwitterLogo weight="fill" className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30 transition-colors"
          >
            <InstagramLogo weight="fill" className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30 transition-colors"
          >
            <FacebookLogo weight="fill" className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 overflow-hidden rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground truncate">
            {url}
          </div>
          <Button
            type="button"
            size="sm"
            className="px-4"
            onClick={handleCopyLink}
          >
            <Link2 className="mr-2 size-4" />
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
