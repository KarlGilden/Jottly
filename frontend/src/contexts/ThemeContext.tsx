import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
	themeMode: ThemeMode;
	setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
}

const THEME_STORAGE_KEY = "journal-lang-theme";

interface Props {
	children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType>({
	themeMode: "light",
	setThemeMode: function (value: SetStateAction<ThemeMode>): void {
		throw new Error("Function not implemented." + value);
	},
});

export const ThemeProvider = ({ children }: Props) => {
	const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
		if (typeof window === "undefined") {
			return "light";
		}

		return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
			? "dark"
			: "light";
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", themeMode === "dark");
		window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
	}, [themeMode]);

	const value = {
		themeMode,
		setThemeMode,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	return useContext(ThemeContext);
};
