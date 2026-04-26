import { useSavedWords } from "../api/queries/useSavedWords";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";

export function SavedWordsPage() {
  const savedWordsQuery = useSavedWords();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pt-8">
      <div>
        <h2 className="text-2xl font-semibold">Saved words</h2>
        <p className="text-sm text-muted-foreground">Vocabulary saved from sentence review appears here.</p>
      </div>

      {savedWordsQuery.isLoading ? <LoadingState /> : null}
      {savedWordsQuery.error ? <ErrorState message={savedWordsQuery.error.message} /> : null}
      {savedWordsQuery.data ? (
        <div className="space-y-3">
          {savedWordsQuery.data.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
              No saved words yet.
            </div>
          ) : (
            savedWordsQuery.data.map((savedWord) => (
              <div key={savedWord.id} className="rounded-xl border border-border bg-surface p-5">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-base font-semibold">{savedWord.word}</p>
                  <p className="text-xs text-muted-foreground/80">{new Date(savedWord.createdAt).toLocaleString()}</p>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{savedWord.translation}</p>
                <p className="text-sm leading-7">{savedWord.contextSentence}</p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
