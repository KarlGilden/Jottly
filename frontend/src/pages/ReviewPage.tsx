import { Link } from "react-router-dom";

import { useEntries } from "../api/queries/useEntries";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";

export function ReviewPage() {
  const entriesQuery = useEntries();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Review</h2>
        <p className="text-sm text-muted-foreground">Recent journal entries.</p>
      </div>

      {entriesQuery.isLoading ? <LoadingState /> : null}
      {entriesQuery.error ? <ErrorState message={entriesQuery.error.message} /> : null}
      {entriesQuery.data ? (
        <div className="space-y-4">
          {entriesQuery.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          ) : (
            entriesQuery.data.map((entry) => (
              <Link
                key={entry.id}
                to={`/entries/${entry.id}`}
                className="block border-b border-border pb-4 transition-colors hover:text-foreground"
              >
                <div className="mb-1 flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{new Date(entry.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground/80">{new Date(entry.createdAt).toLocaleTimeString()}</p>
                </div>
                <p className="truncate text-sm text-muted-foreground">{entry.title}</p>
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
