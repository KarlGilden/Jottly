import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";

export interface CreateTranslationsVariables {
  entryId: number;
  targetLanguages: string[];
}

export interface CreateTranslationsResponse {
  success: boolean;
}

export function useCreateTranslations() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<CreateTranslationsResponse, Error, CreateTranslationsVariables>({
    mutationFn: (data) =>
      fetch({
        method: "POST",
        path: "/translations",
        body: data,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entry(variables.entryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.ENTRIES });
    },
  });
}
