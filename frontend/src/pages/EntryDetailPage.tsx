import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateAudio } from "../api/mutations/useCreateAudio";
import { useCreateSavedWord } from "../api/mutations/useCreateSavedWord";
import { EntryTranslation, useEntry } from "../api/queries/useEntry";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { useExportToLingq } from "../api/mutations/useExportToLingq";
import { useAlert } from "../contexts/AlertContext";
import { MdShortText } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import { useLanguage } from "../contexts/LanguageContext";
import SentenceView from "../components/SentenceView";
import IconToggle from "../components/IconToggle";

type ReviewMode = "text" | "sentence";

export function EntryDetailPage() {
	const { createAlert } = useAlert();
	const { language } = useLanguage();

	const params = useParams();

	const entryId = params.id ? Number(params.id) : null;

	const { data: entry, error, isLoading } = useEntry(entryId, language);

	const createAudioMutation = useCreateAudio();
	const createSavedWordMutation = useCreateSavedWord();
	const { mutate: exportToLingq } = useExportToLingq();

	const [reviewMode, setReviewMode] = useState<ReviewMode>("text");
	const [lingqLessonLink, setLinqLessonLink] = useState("");

	const activeTranslation = useMemo(() => {
		if (!entry) {
			return null;
		}

		return (
			entry.translations.find(
				(translation) => translation.language === language,
			) ??
			entry.translations[0] ??
			null
		);
	}, [entry, language]);

	const translatedSentences = useMemo(
		() =>
			activeTranslation?.sentences.filter(
				(sentence) => sentence.translatedSentence.trim().length > 0,
			) ?? [],
		[activeTranslation],
	);

	const handleExport = (data?: EntryTranslation) => {
		if (!entry || !data) return;

		exportToLingq(
			{
				text: data.content ?? "",
				title:
					entry.title + " " + new Date(entry.createdAt).toLocaleDateString(),
				status: "private",
				save: true,
				language: data.language,
				tags: [],
			},
			{
				onSuccess: (data) => {
					createAlert({
						title: "Success",
						message: "Imported to LingQ",
						type: "success",
					});

					setLinqLessonLink(data.lessonURL);
				},

				onError: () =>
					createAlert({
						title: "Error",
						message: "Something went wrong",
						type: "error",
					}),
			},
		);
	};

	if (isLoading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState message={error.message} />;
	}

	if (!entry) {
		return <ErrorState message="Entry not found" />;
	}

	return (
		<div className="flex flex-col w-full max-w-[900px] gap-5 pt-8">
			<div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex min-w-0 items-center gap-4">
					<h1 className="font-semibold text-3xl text-foreground">
						{entry.title}
					</h1>
					<p className="text-xl font-semibold">
						{new Date(entry.createdAt).toLocaleDateString()}
					</p>
				</div>
				<div className="flex items-center gap-4">
					{lingqLessonLink ? (
						<a href={lingqLessonLink} target="_blank">
							<button
								type="button"
								className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								Go to LingQ lesson!
							</button>
						</a>
					) : (
						<button
							type="button"
							className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							onClick={() => handleExport(activeTranslation ?? undefined)}
						>
							Export to LingQ
						</button>
					)}
					<IconToggle
						LeftIcon={BsCardText}
						RightIcon={MdShortText}
						state={reviewMode === "text" ? true : false}
						setState={setReviewMode}
					/>
				</div>
			</div>

			{activeTranslation ? (
				reviewMode === "text" ? (
					<div className="min-h-[50vh]">
						<p className="whitespace-pre-wrap text-lg leading-9 text-foreground sm:text-xl">
							{activeTranslation.content}
						</p>
					</div>
				) : (
					<SentenceView
						activeTranslation={activeTranslation}
						translatedSentences={translatedSentences}
					/>
				)
			) : (
				<p className="text-sm text-muted-foreground">
					No translation is ready for the selected language yet.
				</p>
			)}

			<div className="fixed inset-x-0 bottom-0 border-t border-border bg-background">
				<div className="app-content-shell mx-auto flex max-w-4xl flex-col gap-3 py-4">
					{activeTranslation?.audioUrl ? (
						<audio
							className="w-full"
							controls
							src={`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001"}${activeTranslation.audioUrl}`}
						/>
					) : activeTranslation ? (
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm text-muted-foreground">
								Audio has not been generated for this translation yet.
							</p>
							<button
								type="button"
								disabled={createAudioMutation.isPending}
								className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
								onClick={() =>
									createAudioMutation.mutate({
										entryId: entry.id,
										translationId: activeTranslation.id,
									})
								}
							>
								{createAudioMutation.isPending
									? "Generating..."
									: "Generate Audio"}
							</button>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							Translation unavailable for the selected language.
						</p>
					)}

					{createAudioMutation.error ? (
						<ErrorState message={createAudioMutation.error.message} />
					) : null}
				</div>
			</div>
		</div>
	);
}
