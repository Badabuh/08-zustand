import type { Notes, NoteTag } from "./note";

export interface NotesQueryParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
}

export interface NotesResponse {
  notes: Notes;
  totalPages: number;
}
