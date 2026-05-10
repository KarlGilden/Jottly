import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateEntry } from "../api/mutations/useCreateEntry";
import { useUpdateEntry } from "../api/mutations/useUpdateEntry";
import { useEntries } from "../api/queries/useEntries";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { useLanguage } from "../contexts/LanguageContext";
import { LuPenLine } from "react-icons/lu";
import Button from "../components/common/Button";
import HeaderText from "../components/common/HeaderText";
import SubheaderText from "../components/common/SubheaderText";
import Page from "../components/common/Page";

export function JournalPage() {
	const navigate = useNavigate();
	const { language } = useLanguage();

	const {
		data: entries,
		isLoading: isEntryLoading,
		error: entryError,
	} = useEntries();

	const {
		mutateAsync: createEntry,
		isPending: isCreatePending,
		error: createEntryError,
	} = useCreateEntry();

	const {
		mutateAsync: updateEntry,
		isPending: isUpdatePending,
		error: updateEntryError,
	} = useUpdateEntry();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isEditingToday, setIsEditingToday] = useState(false);

	const todaysEntry = useMemo(
		() =>
			entries?.find(
				(entry) =>
					new Date(entry.createdAt).toDateString() ===
					new Date().toDateString(),
			) ?? null,
		[entries],
	);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const entry = todaysEntry
			? await updateEntry({
					id: todaysEntry.id,
					title,
					content,
					targetLanguages: [language],
				})
			: await createEntry({
					title,
					content,
					targetLanguages: [language],
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

	const isSaving = isCreatePending || isUpdatePending;

	if (isEntryLoading) {
		return <LoadingState />;
	}

	if (entryError) {
		return <ErrorState message={entryError.message} />;
	}

	return (
		<Page>
			<div className="flex flex-col">
				<div className="mb-8 flex items-center gap-3">
					<div className="w-14 h-14 bg-primary rounded-[20px] flex items-center justify-center">
						<LuPenLine className="w-7 h-7 text-white" strokeWidth={2.5} />
					</div>
					<div>
						<HeaderText text={"Jot your thoughts"} />
						<SubheaderText text={new Date().toDateString()} />
					</div>
				</div>
				{!todaysEntry || isEditingToday ? (
					<form
						className="relative flex flex-col shadow-border gap-4 px-4 py-2 md:px-8 md:py-4 rounded-[1.25rem] w-full bg-foreground"
						onSubmit={handleSubmit}
					>
						<div className="flex ">
							<input
								className="w-full py-4 border-b-2 border-gray-300 border-solid outline-none text-main-text font-bold placeholder:text-placeholder text-3xl"
								maxLength={20}
								placeholder="Title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
							/>
						</div>

						<textarea
							className="py-5 min-h-80 w-full text-xl resize-none text-main-text font-semibold text-base leading-8 outline-none placeholder:text-placeholder"
							placeholder="Write your journal entry here..."
							value={content}
							onChange={(event) => setContent(event.target.value)}
						/>
						<div className="relative flex items-center justify-between">
							{todaysEntry ? (
								<Button
									content={"Cancel"}
									onClick={() => {
										setIsEditingToday(false);
										setTitle("");
										setContent("");
									}}
									isFloating
								/>
							) : (
								<span />
							)}
							<Button
								type="submit"
								color="primary"
								disabled={isSaving || content.trim().length === 0}
								content={
									isSaving ? "Saving..." : todaysEntry ? "Update" : "Save"
								}
								isFloating
							/>
						</div>
						{createEntryError ? (
							<ErrorState message={createEntryError.message} />
						) : null}
						{updateEntryError ? (
							<ErrorState message={updateEntryError.message} />
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
							{entries?.map((entry) => (
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
		</Page>
	);
}
