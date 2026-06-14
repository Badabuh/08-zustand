"use client";

import { useQuery } from "@tanstack/react-query";
import { getNoteById } from "../../../lib/api";
import css from "./NoteDetails.module.css";
import { useParams } from "next/navigation";

export default function NoteDetailsClient() {
  const { id } = useParams() as { id: string };
  const noteID = typeof id === "string" ? id : undefined;
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", noteID],
    queryFn: () => getNoteById(noteID!),
    enabled: !!noteID,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <>Loading, please wait...</>;
  }

  if (error || !note) {
    return <>Something went wrong.</>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}
