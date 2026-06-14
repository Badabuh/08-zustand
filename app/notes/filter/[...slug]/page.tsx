import { NOTE_TAGS } from "@/types/note";
import { fetchNotes } from "../../../../lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import NotesClient from "./Notes.client";
interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const SITE_URL = "https://notehub.app";
const OG_IMAGE_URL =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

const getFilterParams = async (params: NotesFilterPageProps["params"]) => {
  const { slug } = await params;
  const rawTag = slug[0];

  if (rawTag === "all") {
    return {
      tag: undefined,
      title: "Notes - All",
      description: "A list of notes filtered by all tags",
      openGraph: {
        title: "Notes - All",
        description: "A list of notes filtered by all tags",
        url: `${SITE_URL}/notes/filter/all`,
        images: [
          {
            url: OG_IMAGE_URL,
            width: 1200,
            height: 630,
            alt: "Notes - All",
          },
        ],
      },
      isInvalid: false,
    };
  }

  const tag = NOTE_TAGS.find((noteTag) => noteTag === rawTag);

  if (!tag) {
    return {
      tag: undefined,
      title: "Notes - All Tags",
      description: "A list of notes filtered by all tags",
      openGraph: {
        title: "Notes - All Tags",
        description: "A list of notes filtered by all tags",
        url: `${SITE_URL}/notes/filter/all`,
        images: [
          {
            url: OG_IMAGE_URL,
            width: 1200,
            height: 630,
            alt: "Notes - All Tags",
          },
        ],
      },
      isInvalid: true,
    };
  }

  return {
    tag,
    title: `Notes - ${tag}`,
    description: `A list of notes filtered by ${tag}`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `A list of notes filtered by ${tag}`,
      url: `${SITE_URL}/notes/filter/${tag}`,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `Notes - ${tag}`,
        },
      ],
    },
    isInvalid: false,
  };
};

export const generateMetadata = async ({
  params,
}: NotesFilterPageProps): Promise<Metadata> => {
  const { title, description, openGraph } = await getFilterParams(params);

  return { title, description, openGraph };
};

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { tag, isInvalid } = await getFilterParams(params);

  if (isInvalid) {
    redirect("/notes/filter/all");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", tag, page: 1, perPage: 12 }],
    queryFn: () => fetchNotes({ search: "", tag, page: 1, perPage: 12 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
