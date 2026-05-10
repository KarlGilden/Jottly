import { useEffect, useRef, useState } from "react";
import { EntrySentencePair, EntryTranslation } from "../api/queries/useEntry";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface IProps {
	translatedSentences: EntrySentencePair[];
	activeTranslation: EntryTranslation;
}

const SentenceView = ({ translatedSentences, activeTranslation }: IProps) => {
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
	const [sentenceVisible, setSentenceVisible] = useState(true);
	const touchStartXRef = useRef<number | null>(null);

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

	if (translatedSentences.length === 0)
		return (
			<p className="text-sm text-main-text">
				No sentence content is available for this translation yet.
			</p>
		);

	return (
		<div className="flex h-full items-center justify-center gap-8 text-main-text">
			<button
				type="button"
				className="hidden sm:block cursor-pointer h-full px-10 py-2 text-sm transition-colors hover:text-primary font-black disabled:cursor-not-allowed disabled:opacity-50"
				disabled={currentSentenceIndex === 0}
				onClick={goToPreviousSentence}
			>
				<FaAngleLeft className="text-5xl" />
			</button>
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
					<p className="mt-4 text-2xl leading-10 sm:text-3xl sm:leading-[3.5rem]">
						{currentSentence?.translatedSentence}
					</p>
				</div>
			</div>

			<button
				type="button"
				className="hidden sm:block cursor-pointer h-full px-10 py-2 text-sm text-muted-foreground transition-colors hover:text-primary font-black disabled:cursor-not-allowed disabled:opacity-50"
				disabled={currentSentenceIndex >= translatedSentences.length - 1}
				onClick={goToNextSentence}
			>
				<FaAngleRight className="text-5xl" />
			</button>
		</div>
	);
};

export default SentenceView;
