import { NoteTag } from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Note {
  title: string;
  content: string;
  tag: NoteTag;
}

type Store = {
  draft: Note;
  setDraft: (note: Partial<Note>) => void;
  clearDraft: () => void;
};
const initialDraft: Note = { title: "", content: "", tag: "Todo" };

export const useStore = create<Store>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
