"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteDraftMedia,
  getDraftMedia,
  saveDraftMedia,
} from "@/modules/post/drafts/localDraftMedia";
import {
  type LocalPostDraft,
  usePostDraftStore,
} from "@/modules/post/drafts/usePostDraftStore";

interface ShareWorkButtonProps {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  label?: string;
}

export function ShareWorkButton({
  size = "default",
  variant = "outline",
  className,
  label = "Share work",
}: ShareWorkButtonProps) {
  const router = useRouter();
  const drafts = usePostDraftStore((state) => state.drafts);
  const hasHydrated = usePostDraftStore((state) => state.hasHydrated);
  const [open, setOpen] = useState(false);

  const openCreator = () => {
    if (!hasHydrated) return;

    if (drafts.length) {
      setOpen(true);
    } else {
      router.push("/create");
    }
  };

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} onClick={openCreator} disabled={!hasHydrated}>
        <Plus data-icon="inline-start" />
        {label}
      </Button>
      <DraftPickerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function DraftPickerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const drafts = usePostDraftStore((state) => state.drafts);
  const removeDraft = usePostDraftStore((state) => state.removeDraft);

  const startFresh = () => {
    onOpenChange(false);
    router.push("/create");
  };

  const openDraft = (id: string) => {
    onOpenChange(false);
    router.push(`/create?draft=${encodeURIComponent(id)}`);
  };

  const discardDraft = async (draft: LocalPostDraft) => {
    const media = await getDraftMedia(draft.id).catch(() => null);
    removeDraft(draft.id);
    await deleteDraftMedia(draft.id).catch(() => undefined);

    toast("Draft removed", {
      action: {
        label: "Undo",
        onClick: () => {
          usePostDraftStore.getState().saveDraft(draft);
          if (media) {
            void saveDraftMedia(draft.id, media);
          }
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(46rem,calc(100dvh-2rem))] overflow-y-auto p-0 sm:max-w-5xl">
        <div className="grid sm:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="relative overflow-hidden bg-primary p-6 text-primary-foreground sm:min-h-full sm:p-7">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/70">Your local desk</p>
            <p className="mt-3 max-w-44 font-heading text-3xl font-medium leading-[1.05] tracking-[-0.045em]">
              A good piece can wait.
            </p>
            <p className="mt-4 max-w-48 text-sm leading-6 text-primary-foreground/75">
              Pick up a thread, or start somewhere new.
            </p>
            <div className="absolute -right-7 -bottom-7 grid size-32 rotate-8 grid-cols-2 gap-1 border border-primary-foreground/25 bg-primary-foreground/10 p-2">
              <span className="bg-primary-foreground/70" />
              <span className="bg-primary-foreground/25" />
              <span className="bg-primary-foreground/25" />
              <span className="bg-primary-foreground/70" />
            </div>
          </aside>
          <div className="p-6 sm:p-8">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-3xl tracking-[-0.04em]">Continue a draft</DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-sm leading-6">
                Drafts are saved only on this device. Pick up where you left off, or begin with a fresh piece.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {drafts.map((draft, index) => (
                <DraftTile key={draft.id} draft={draft} index={index} onOpen={openDraft} onDiscard={discardDraft} />
              ))}
              <Button type="button" variant="outline" onClick={startFresh} className="h-auto aspect-4/3 flex-col gap-3 border-dashed text-muted-foreground hover:text-foreground">
                <Plus />
                New work
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DraftTile({
  draft,
  index,
  onOpen,
  onDiscard,
}: {
  draft: LocalPostDraft;
  index: number;
  onOpen: (id: string) => void;
  onDiscard: (draft: LocalPostDraft) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(draft.mediaName));

  useEffect(() => {
    let isCurrent = true;
    let objectUrl: string | null = null;

    void getDraftMedia(draft.id)
      .then((file) => {
        if (!isCurrent || !file) return;
        objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [draft.id]);

  const title = draft.title.trim() || `draft-${index + 1}`;

  return (
    <div className="group relative aspect-4/3">
      <div className="absolute inset-0 overflow-hidden border border-border bg-muted">
        <button
          type="button"
          onClick={() => onOpen(draft.id)}
          className="absolute inset-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
        {isLoading ? (
          <Skeleton className="size-full rounded-none" />
        ) : previewUrl ? (
          <Image src={previewUrl} alt={`Preview of ${title}`} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" unoptimized />
        ) : (
          <div className="flex size-full items-center justify-center bg-secondary text-sm text-muted-foreground">No image yet</div>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-3 pb-3 pt-10 text-primary-foreground">
          <span className="block truncate text-sm font-medium">{title}</span>
          <span className="mt-0.5 block text-xs text-primary-foreground/75">Edited {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}</span>
        </span>
        </button>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label={`Remove ${title}`}
        className="absolute -top-2 -right-2 z-10 rounded-full border-background bg-background shadow-sm"
        onClick={() => void onDiscard(draft)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
