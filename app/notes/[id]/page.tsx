import NoteDetailsClient from "./NoteDetails.client";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getNoteById } from "../../../lib/api";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const { id } = await params;

  try {
    const note = await getNoteById(id);
    return { title: note.title, description: note.content };
  } catch {
    return { title: "Note", description: "Note not found" };
  }
};

export default async function NoteDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
