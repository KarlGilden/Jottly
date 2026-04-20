import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";

export interface CreateEntryVariables {
  title?: string;
  content: string;
  targetLanguages: string[];
}

export interface CreateEntryResponse {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
}

export function useCreateEntry() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<CreateEntryResponse, Error, CreateEntryVariables>({
    mutationFn: (data) =>
      fetch({
        method: "POST",
        path: "/entries",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ENTRIES });
    },
  });
}
