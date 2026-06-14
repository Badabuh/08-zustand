import NoteForm from "@/components/NoteForm/NoteForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Note",
  description: "Create a new note in NoteHub",
};
export default function CreateNotePage() {
  return <NoteForm />;
}
