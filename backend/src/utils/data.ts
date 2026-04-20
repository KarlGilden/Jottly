export const useFetch = async <T>(
	url: string,
	config?: RequestInit,
): Promise<T> => {
	const response = await fetch(url, config);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json() as Promise<T>;
};
