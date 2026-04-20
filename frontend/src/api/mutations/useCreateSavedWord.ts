import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";
import type { SavedWord } from "../queries/useSavedWords";

export interface CreateSavedWordVariables {
  word: string;
  translation: string;
  contextSentence: string;
}

export function useCreateSavedWord() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<SavedWord, Error, CreateSavedWordVariables>({
    mutationFn: (data) =>
      fetch({
        method: "POST",
        path: "/saved-words",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.SAVED_WORDS });
    },
  });
}
