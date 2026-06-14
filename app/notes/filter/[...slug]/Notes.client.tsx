"use client";
import css from "./App.module.css";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../../../../components/NoteList/NoteList";
import { keepPreviousData } from "@tanstack/react-query";
import type { NoteTag } from "@/types/note";

const NOTES_PER_PAGE = 12;

export default function NotesClient({ tag }: { tag?: NoteTag }) {
  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const debouncedSetText = useDebouncedCallback(setText, 300);

  const handleSearchChange = (value: string) => {
    debouncedSetText(value);
    setCurrentPage(1);
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
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      <NoteList notes={data?.notes ?? []} />
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
