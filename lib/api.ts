import axios from "axios";
import type { CreateNotePayload, Note } from "../types/note";
import type { NotesQueryParams, NotesResponse } from "../types/noteApi";

const apiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
  searchParams: NotesQueryParams,
): Promise<NotesResponse> {
  const response = await apiClient.get<NotesResponse>("/notes", {
    params: searchParams,
  });
  return response.data;
}

export async function createNote(note: CreateNotePayload): Promise<Note> {
  const response = await apiClient.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await apiClient.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await apiClient.get<Note>(`/notes/${id}`);
  return response.data;
}
