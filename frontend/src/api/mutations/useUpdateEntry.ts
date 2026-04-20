import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";
import type { CreateEntryResponse } from "./useCreateEntry";

export interface UpdateEntryVariables {
  id: number;
  title?: string;
  content: string;
  targetLanguages: string[];
}

export function useUpdateEntry() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<CreateEntryResponse, Error, UpdateEntryVariables>({
    mutationFn: ({ id, ...body }) =>
      fetch({
        method: "PUT",
        path: `/entries/${id}`,
        body,
      }),
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ENTRIES });
      queryClient.invalidateQueries({ queryKey: queryKeys.entry(entry.id) });
    },
  });
}
