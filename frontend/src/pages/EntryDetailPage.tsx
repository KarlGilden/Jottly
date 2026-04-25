import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

type ReviewMode = "text" | "sentence";

export function EntryDetailPage() {
	const { createAlert } = useAlert();
	const { language } = useLanguage();
	const nav = useNavigate();
	const params = useParams();

	const entryId = params.id ? Number(params.id) : null;

	const { data: entry, error, isLoading } = useEntry(entryId, language);

	const createAudioMutation = useCreateAudio();
	const createSavedWordMutation = useCreateSavedWord();
	const { mutate: exportToLingq } = useExportToLingq();

	const [reviewMode, setReviewMode] = useState<ReviewMode>("text");
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
	const [sentenceVisible, setSentenceVisible] = useState(true);
	const [lingqLessonLink, setLinqLessonLink] = useState("");

	const touchStartXRef = useRef<number | null>(null);

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

	const currentSentence = translatedSentences[currentSentenceIndex] ?? null;

	useEffect(() => {
		setCurrentSentenceIndex(0);
	}, [activeTranslation?.id]);

	useEffect(() => {
		setSentenceVisible(false);
		const timeout = window.setTimeout(() => {
			setSentenceVisible(true);
		}, 120);

		return () => window.clearTimeout(timeout);
	}, [currentSentenceIndex]);

	const goToPreviousSentence = () => {
		setCurrentSentenceIndex((currentIndex) => Math.max(currentIndex - 1, 0));
	};

	const goToNextSentence = () => {
		setCurrentSentenceIndex((currentIndex) =>
			Math.min(currentIndex + 1, translatedSentences.length - 1),
		);
	};

	const handleTouchStart = (clientX: number) => {
		touchStartXRef.current = clientX;
	};

	const handleTouchEnd = (clientX: number) => {
		if (touchStartXRef.current === null) {
			return;
		}

		const distance = clientX - touchStartXRef.current;
		touchStartXRef.current = null;

		if (distance <= -40) {
			goToNextSentence();
		}

		if (distance >= 40) {
			goToPreviousSentence();
		}
	};

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
		<div className="mx-auto max-w-4xl space-y-5 pb-40">
			<div className="flex flex-col gap-1 pb-2 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex min-w-0 items-center gap-4">
					<h1 className="font-semibold text-xl min-w-0 truncate text-foreground">
						{entry.title}
					</h1>
					<p className="text-lg w-32 shrink-0 text-sm text-muted-foreground sm:w-40">
						{new Date(entry.createdAt).toLocaleDateString()}
					</p>
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
				</div>
				<div className="inline-flex w-full rounded-md bg-muted p-1 sm:w-auto">
					<button
						type="button"
						className={[
							"flex-1 rounded-md px-3 py-2 text-sm transition-colors sm:flex-none",
							reviewMode === "text"
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground",
						].join(" ")}
						onClick={() => setReviewMode("text")}
					>
						<BsCardText className="text-xl" />
					</button>
					<button
						type="button"
						className={[
							"flex-1 rounded-md px-3 py-2 text-sm transition-colors sm:flex-none",
							reviewMode === "sentence"
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground",
						].join(" ")}
						onClick={() => setReviewMode("sentence")}
					>
						<MdShortText className="text-2xl" />
					</button>
				</div>
			</div>

			{activeTranslation ? (
				<div className="space-y-6">
					{reviewMode === "text" ? (
						<div className="min-h-[50vh]">
							<p className="whitespace-pre-wrap text-lg leading-9 text-foreground sm:text-xl">
								{activeTranslation.content}
							</p>
						</div>
					) : translatedSentences.length > 0 ? (
						<div className="flex min-h-[55vh] flex-col items-center justify-center gap-8">
							<div
								className="flex min-h-56 w-full items-center justify-center px-2 text-center sm:px-8"
								onTouchEnd={(event) =>
									handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
								}
								onTouchStart={(event) =>
									handleTouchStart(event.touches[0]?.clientX ?? 0)
								}
							>
								<div
									className={[
										"w-full transition-opacity duration-200",
										sentenceVisible ? "opacity-100" : "opacity-0",
									].join(" ")}
								>
									<p className="mt-4 text-2xl leading-10 text-foreground sm:text-3xl sm:leading-[3.5rem]">
										{currentSentence?.translatedSentence}
									</p>
								</div>
							</div>

							<div className="flex w-full items-center justify-between gap-3">
								<button
									type="button"
									className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
									disabled={currentSentenceIndex === 0}
									onClick={goToPreviousSentence}
								>
									Previous
								</button>
								<p className="text-center text-sm text-muted-foreground">
									Swipe on mobile or use the controls.
								</p>
								<button
									type="button"
									className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
									disabled={
										currentSentenceIndex >= translatedSentences.length - 1
									}
									onClick={goToNextSentence}
								>
									Next
								</button>
							</div>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							No sentence content is available for this translation yet.
						</p>
					)}

					{createSavedWordMutation.error ? (
						<ErrorState message={createSavedWordMutation.error.message} />
					) : null}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">
					No translation is ready for the selected language yet.
				</p>
			)}

			<div className="fixed inset-x-0 bottom-0 border-t border-border bg-background">
				<div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
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
