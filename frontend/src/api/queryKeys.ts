export const queryKeys = {
  ENTRIES: ["entries"] as const,
  entry: (id: number) => ["entries", id] as const,
  SAVED_WORDS: ["saved-words"] as const,
  LINGQ_STATUS: ["lingq-status"] as const,
};
