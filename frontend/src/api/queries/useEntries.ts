import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { useFetch } from "../useFetch";

export interface EntryListItem {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  languages: string[];
}

export function useEntries() {
  const fetch = useFetch();

  return useQuery<EntryListItem[]>({
    queryFn: () =>
      fetch({
        method: "GET",
        path: "/entries",
      }),
    queryKey: queryKeys.ENTRIES,
  });
}
