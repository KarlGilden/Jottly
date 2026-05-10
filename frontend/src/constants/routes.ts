import { Language } from "./languages";

export const routes = {
	HOME: "/",
	JOURNAL: "/journal",
	REVIEW: "/review",
	ENTRIES: (id: string) => `/entries/${id}`,
	SETTINGS: "/settings",
	LOGIN: "/login",
};

export const fileRoutes = {
	FLAGS: (language: Language) => `/flags/${language}.svg`,
};
