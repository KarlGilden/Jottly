export interface LanguageOption {
	code: Language;
	label: string;
}

export enum Language {
	Spanish = "es",
	German = "de",
	Japanese = "ja",
	French = "fr",
	Italian = "it",
}

export const languageOptions: LanguageOption[] = [
	{ code: Language.Spanish, label: "Spanish" },
	{ code: Language.French, label: "French" },
	{ code: Language.German, label: "German" },
	{ code: Language.Italian, label: "Italian" },
	{ code: Language.Japanese, label: "Japanese" },
];

export const defaultLanguage = languageOptions[0].code;
export const targetLanguages = languageOptions.map((language) => language.code);
