import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { Language } from "../constants/languages";

interface LanguageContextType {
	language: Language;
	setLanguage: Dispatch<SetStateAction<Language>>;
}

const LANGUAGE_STORAGE_KEY = "journal-lang-language";

interface Props {
	children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType>({
	language: Language.Spanish,
	setLanguage: function (value: SetStateAction<Language>): void {
		throw new Error("Function not implemented.");
	},
});

export const LanguageProvider = ({ children }: Props) => {
	const [language, setLanguage] = useState<Language>(() => {
		if (typeof window === "undefined") {
			return Language.Spanish;
		}

		const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (
			storedLanguage === null ||
			Object.values(Language).includes(storedLanguage as Language)
		) {
			return Language.Spanish;
		}

		return storedLanguage as Language;
	});

	useEffect(() => {
		window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
	}, [language]);

	const value = {
		language,
		setLanguage,
	};

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	return useContext(LanguageContext);
};
