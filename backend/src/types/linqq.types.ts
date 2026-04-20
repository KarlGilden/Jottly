export interface LingqImportInput {
	status: "private" | "public";
	save: boolean;
	language: string;
	text: string;
	tags: string[];
	title: string;
}

export interface LingqImportOutput {
	id: number;
	contentId: number;
	collectionId: number;
	collectionTitle: string;
	url: string;
	originalUrl: string | null;
	imageUrl: string;
	originalImageUrl: string;
	providerImageUrl: string;
	title: string;
	description: string;
	duration: number;
	audioUrl: string | null;
	audioPending: boolean;
	giveRoseUrl: string;
	wordCount: number;
	uniqueWordCount: number;
	pubDate: string;
	sharedDate: string | null;
	sharedById: number;
	sharedByName: string;
	sharedByRole: string | null;
	external_type: string | null;
	type: string; //enum
	status: string; // enum
	pos: number;
	price: number;
	lessonURL: string;
}
