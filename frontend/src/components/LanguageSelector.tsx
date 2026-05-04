import { Language, languageOptions } from "../constants/languages";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSelector = () => {
	const { language, setLanguage } = useLanguage();

	return (
		<label className="flex items-center gap-2 text-sm text-muted-foreground">
			<select
				className="rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
				value={language}
				onChange={(event) => setLanguage(event.target.value as Language)}
			>
				{languageOptions.map((language) => (
					<option key={language.code} value={language.code}>
						{language.label}
					</option>
				))}
			</select>
		</label>
	);
};

export default LanguageSelector;
