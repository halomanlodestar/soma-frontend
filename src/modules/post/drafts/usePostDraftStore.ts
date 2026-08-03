"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface LocalPostDraft {
  id: string;
  title: string;
  content: string;
  somaId: string;
  mediaName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PostDraftState {
  drafts: LocalPostDraft[];
  hasHydrated: boolean;
  saveDraft: (draft: LocalPostDraft) => string[];
  removeDraft: (id: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const maxDrafts = 12;

export const usePostDraftStore = create<PostDraftState>()(
  persist(
    (set) => ({
      drafts: [],
      hasHydrated: false,
      saveDraft: (draft) => {
        let removedIds: string[] = [];

        set((state) => {
          const drafts = [
            draft,
            ...state.drafts.filter((existingDraft) => existingDraft.id !== draft.id),
          ].sort(
            (first, second) =>
              new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
          );
          const keptDrafts = drafts.slice(0, maxDrafts);
          removedIds = drafts.slice(maxDrafts).map((removedDraft) => removedDraft.id);

          return { drafts: keptDrafts };
        });

        return removedIds;
      },
      removeDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "soma-post-drafts",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ drafts: state.drafts }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
