import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export default function NotFound() {
  return (
    <>
      <h1>404 - Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </>
  );
}

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "Sorry, the page you are looking for does not exist.",
};
