import { useEntries } from "../api/queries/useEntries";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import ListItem from "../components/ListItem";

export function ReviewPage() {
	const entriesQuery = useEntries();

	return (
		<div className="w-full max-w-[900px] space-y-8 pt-8">
			<div>
				<h2 className="text-2xl font-semibold">Previous entries</h2>
			</div>

			{entriesQuery.isLoading ? <LoadingState /> : null}

			{entriesQuery.error ? (
				<ErrorState message={entriesQuery.error.message} />
			) : null}

			{entriesQuery.data ? (
				<div className="space-y-4">
					{entriesQuery.data.length === 0 ? (
						<p className="text-sm text-muted-foreground">No entries yet.</p>
					) : (
						entriesQuery.data.map((entry) => (
							<ListItem
								id={entry.id}
								link={`/entries/${entry.id}`}
								heading={new Date(entry.createdAt).toLocaleDateString()}
								subHeading={entry.title}
								rightInfo={new Date(entry.createdAt).toLocaleTimeString()}
							/>
						))
					)}
				</div>
			) : null}
		</div>
	);
}
