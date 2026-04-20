import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateEntry } from "../api/mutations/useCreateEntry";
import { useUpdateEntry } from "../api/mutations/useUpdateEntry";
import { useEntries } from "../api/queries/useEntries";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";

interface JournalPageProps {
	selectedLanguage: string;
}

export function JournalPage({ selectedLanguage }: JournalPageProps) {
	const navigate = useNavigate();
	const entriesQuery = useEntries();
	const createEntryMutation = useCreateEntry();
	const updateEntryMutation = useUpdateEntry();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isEditingToday, setIsEditingToday] = useState(false);

	const todaysEntry = useMemo(
		() =>
			entriesQuery.data?.find(
				(entry) =>
					new Date(entry.createdAt).toDateString() ===
					new Date().toDateString(),
			) ?? null,
		[entriesQuery.data],
	);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const entry = todaysEntry
			? await updateEntryMutation.mutateAsync({
					id: todaysEntry.id,
					title,
					content,
					targetLanguages: [selectedLanguage],
				})
			: await createEntryMutation.mutateAsync({
					title,
					content,
					targetLanguages: [selectedLanguage],
				});

		setTitle("");
		setContent("");
		setIsEditingToday(false);
		navigate(`/entries/${entry.id}`);
	};

	const startEditingToday = () => {
		if (!todaysEntry) {
			return;
		}

		setTitle(todaysEntry.title);
		setContent(todaysEntry.content);
		setIsEditingToday(true);
	};

	const isSaving =
		createEntryMutation.isPending || updateEntryMutation.isPending;

	if (entriesQuery.isLoading) {
		return <LoadingState />;
	}

	if (entriesQuery.error) {
		return <ErrorState message={entriesQuery.error.message} />;
	}

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-8 pt-8">
			{!todaysEntry || isEditingToday ? (
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div className="flex">
						<input
							className="w-full bg-background text-foreground outline-none placeholder:text-muted-foreground text-2xl"
							maxLength={20}
							placeholder="Title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
						/>
						<h2 className="text-xl font-semibold">
							{new Date().toLocaleDateString()}
						</h2>
					</div>

					<textarea
						className="min-h-80 w-full resize-none bg-background px-0 py-0 text-base leading-8 text-foreground outline-none placeholder:text-muted-foreground"
						placeholder="Write your journal entry here..."
						value={content}
						onChange={(event) => setContent(event.target.value)}
					/>
					<div className="flex items-center justify-between">
						{todaysEntry ? (
							<button
								type="button"
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								onClick={() => {
									setIsEditingToday(false);
									setTitle("");
									setContent("");
								}}
							>
								Cancel
							</button>
						) : (
							<span />
						)}
						<button
							type="submit"
							disabled={isSaving || content.trim().length === 0}
							className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSaving
								? "Saving..."
								: todaysEntry
									? "Update entry"
									: "Save entry"}
						</button>
					</div>
					{createEntryMutation.error ? (
						<ErrorState message={createEntryMutation.error.message} />
					) : null}
					{updateEntryMutation.error ? (
						<ErrorState message={updateEntryMutation.error.message} />
					) : null}
				</form>
			) : (
				<div className="space-y-6">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="text-2xl font-semibold">Recent entries</h2>
							<p className="text-sm text-muted-foreground">
								Today&apos;s entry is already saved.
							</p>
						</div>
						<button
							type="button"
							className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							onClick={startEditingToday}
						>
							Edit Today&apos;s Entry
						</button>
					</div>
					<div className="space-y-4">
						{entriesQuery.data?.map((entry) => (
							<Link
								key={entry.id}
								to={`/entries/${entry.id}`}
								className="block border-b border-border pb-4 transition-colors hover:text-foreground"
							>
								<div className="mb-1 flex items-center justify-between gap-4">
									<p className="text-sm font-medium">
										{new Date(entry.createdAt).toLocaleDateString()}
									</p>
									<p className="text-xs text-muted-foreground/80">
										{new Date(entry.createdAt).toLocaleTimeString()}
									</p>
								</div>
								<p className="truncate text-sm text-muted-foreground">
									{entry.title}
								</p>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
