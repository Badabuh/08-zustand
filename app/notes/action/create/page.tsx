import NoteForm from "@/components/NoteForm/NoteForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Note",
  description: "Create a new note in NoteHub",
  openGraph: {
    title: "Create Note | NoteHub",
    description: "Create a new note in NoteHub",
    url: "https://notehub.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create Note | NoteHub",
      },
    ],
  },
};
export default function CreateNotePage() {
  return <NoteForm />;
}
