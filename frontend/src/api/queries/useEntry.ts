import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";

export interface EntrySentencePair {
  originalSentence: string;
  translatedSentence: string;
}

export interface EntryTranslation {
  id: number;
  entryId: number;
  userId: number;
  language: string;
  content: string;
  audioUrl: string | null;
  sentences: EntrySentencePair[];
}

export interface EntryDetail {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  translations: EntryTranslation[];
}

export function useEntry(id: number | null, selectedLanguage: string) {
  const fetch = useFetch();

  return useQuery<EntryDetail>({
    enabled: id !== null,
    queryFn: () =>
      fetch({
        method: "GET",
        path: `/entries/${id}?language=${encodeURIComponent(selectedLanguage)}`,
      }),
    queryKey: id === null ? queryKeys.ENTRIES : [...queryKeys.entry(id), selectedLanguage],
  });
}
