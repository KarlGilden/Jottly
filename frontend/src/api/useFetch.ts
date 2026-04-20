import { useAuth } from "@clerk/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

interface FetchConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export function useFetch() {
  const { getToken } = useAuth();

  return async function fetcher<TResponse>({
    method,
    path,
    body,
    headers: additionalHeaders,
  }: FetchConfig): Promise<TResponse> {
    const token = await getToken();
    const headers: Record<string, string> = { ...additionalHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(payload?.message ?? "Request failed");
    }

    return (await response.json()) as TResponse;
  };
}
