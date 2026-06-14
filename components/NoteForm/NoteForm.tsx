"use client";

import css from "./NoteForm.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { NOTE_TAGS } from "../../types/note";
import type { CreateNotePayload, NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/globalState";

interface NoteFormValues {
  title: string;
  content: string;
  tag: "" | NoteTag;
}

const noteValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(
      [...NOTE_TAGS],
      "Tag must be one of: Todo, Work, Personal, Meeting, Shopping",
    )
    .required("Tag is required"),
});

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useStore();
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationKey: ["createNote"],
    mutationFn: (note: CreateNotePayload) => createNote(note),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.back();
    },
  });

  const handleSubmit = (values: NoteFormValues) => {
    const payload: CreateNotePayload = {
      title: values.title,
      content: values.content,
      tag: values.tag as NoteTag,
    };
    createNoteMutation.mutate(payload);
  };

  return (
    <Formik<NoteFormValues>
      initialValues={draft}
      enableReinitialize
      validationSchema={noteValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              name="title"
              id="title"
              type="text"
              className={css.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e);
                setDraft({ title: e.target.value });
              }}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              name="content"
              id="content"
              rows={8}
              className={css.textarea}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                handleChange(e);
                setDraft({ content: e.target.value });
              }}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field
              as="select"
              id="tag"
              name="tag"
              className={css.select}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(e);
                setDraft({ tag: (e.target.value || "Todo") as NoteTag });
              }}
            >
              <option value="">Select tag</option>
              {NOTE_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={createNoteMutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
