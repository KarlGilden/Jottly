import { useEntries } from "../api/queries/useEntries";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import ListItem from "../components/ListItem";
import HeaderText from "../components/common/HeaderText";
import SubheaderText from "../components/common/SubheaderText";
import Page from "../components/common/Page";

export function ReviewPage() {
	const entriesQuery = useEntries();

	return (
		<Page>
			<div className="flex flex-col gap-5">
				<div>
					<HeaderText text={"Review"} />
					<SubheaderText text={"Review all your previous entries"} />
				</div>

				{entriesQuery.isLoading ? <LoadingState /> : null}

				{entriesQuery.error ? (
					<ErrorState message={entriesQuery.error.message} />
				) : null}

				{entriesQuery.data ? (
					<div className="flex flex-col gap-5">
						{entriesQuery.data.length === 0 ? (
							<p className="text-sm ">No entries yet.</p>
						) : (
							entriesQuery.data.map((entry) => (
								<ListItem
									id={entry.id}
									link={`/entries/${entry.id}`}
									heading={new Date(entry.createdAt).toDateString()}
									subHeading={entry.title}
									rightInfo={new Date(entry.createdAt).toLocaleTimeString()}
								/>
							))
						)}
					</div>
				) : null}
			</div>
		</Page>
	);
}
