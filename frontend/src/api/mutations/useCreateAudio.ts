import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";

export interface AudioRecord {
  id: number;
  translationId: number;
  userId: number;
  audioUrl: string;
  createdAt: string;
}

export interface CreateAudioVariables {
  entryId: number;
  translationId: number;
}

export function useCreateAudio() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<AudioRecord, Error, CreateAudioVariables>({
    mutationFn: ({ translationId }) =>
      fetch({
        method: "POST",
        path: "/audio",
        body: {
          translationId,
        },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entry(variables.entryId) });
    },
  });
}
