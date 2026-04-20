import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";

export interface SavedWord {
  id: number;
  userId: number;
  word: string;
  translation: string;
  contextSentence: string;
  createdAt: string;
}

export function useSavedWords() {
  const fetch = useFetch();

  return useQuery<SavedWord[]>({
    queryFn: () =>
      fetch({
        method: "GET",
        path: "/saved-words",
      }),
    queryKey: queryKeys.SAVED_WORDS,
  });
}
