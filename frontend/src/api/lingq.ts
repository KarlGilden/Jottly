import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";
import { useFetch } from "./useFetch";

export enum ApiKeyStatus {
	NotConnected = 1,
	Connected = 2,
	InvalidKey = 3,
}

interface LingqStatusResponse {
	connected: ApiKeyStatus;
}

interface LingqApiKeyResponse {
	success: boolean;
}

export function useLingqStatus() {
	const fetch = useFetch();

	return useQuery<LingqStatusResponse>({
		queryFn: () =>
			fetch({
				method: "GET",
				path: "/api/lingq/status",
			}),
		queryKey: queryKeys.LINGQ_STATUS,
	});
}

export function useSetLingqApiKey() {
	const fetch = useFetch();
	const queryClient = useQueryClient();

	return useMutation<LingqApiKeyResponse, Error, string>({
		mutationFn: (apiKey) =>
			fetch({
				method: "POST",
				path: "/api/lingq/apikey",
				body: { apiKey },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.LINGQ_STATUS });
		},
	});
}
