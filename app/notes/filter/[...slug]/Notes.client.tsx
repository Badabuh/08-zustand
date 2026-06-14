"use client";
import css from "./NotesPage.module.css";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../../../../components/NoteList/NoteList";
import { keepPreviousData } from "@tanstack/react-query";
import type { NoteTag } from "@/types/note";
import { useRouter } from "next/dist/client/components/navigation";

const NOTES_PER_PAGE = 12;

export default function NotesClient({ tag }: { tag?: NoteTag }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useQuery({
    queryKey: [
      "notes",
      { search: text, tag, page: currentPage, perPage: NOTES_PER_PAGE },
    ],
    queryFn: () =>
      fetchNotes({
        search: text,
        tag,
        page: currentPage,
        perPage: NOTES_PER_PAGE,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const pageCount = Math.max(data?.totalPages ?? 0, 1);

  const debouncedSetText = useDebouncedCallback((value: string) => {
    setText(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    debouncedSetText(value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />
        {data && typeof data.totalPages === "number" && data.totalPages > 1 && (
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => router.push("/notes/action/create")}
        >
          Create note +
        </button>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data?.notes ?? []} />}
    </div>
  );
}
