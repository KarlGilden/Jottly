export interface LanguageOption {
  code: string;
  label: string;
}

export const languageOptions: LanguageOption[] = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
];

export const defaultLanguage = languageOptions[0].code;
export const targetLanguages = languageOptions.map((language) => language.code);
