import fs from "node:fs/promises";
import path from "node:path";

import knex, { type Knex } from "knex";

import {
	AUDIO_DIRECTORY,
	LEGACY_AUDIO_DIRECTORY,
	LEGACY_CLERK_USER_ID,
	LEGACY_DATABASE_FILE,
} from "../utils/constants.js";
import { toMysqlDateTime } from "../utils/datetime.js";
import { resolveEntryTitle } from "../utils/title.js";
import { runDatabaseMigrations } from "./migrations.js";
import { schemaSql } from "./schema.js";

interface LegacyAudioRecord {
	id: number;
	translationId: number;
	userId: number;
	audioUrl: string;
	createdAt: string;
}

interface LegacyJournalEntry {
	id: number;
	userId: number;
	title?: string;
	content: string;
	createdAt: string;
}

interface LegacySavedWord {
	id: number;
	userId: number;
	word: string;
	translation: string;
	contextSentence: string;
	createdAt: string;
}

interface LegacyTranslation {
	id: number;
	entryId: number;
	userId: number;
	language: string;
	content: string;
}

interface LegacyDatabaseSchema {
	audios: LegacyAudioRecord[];
	journalEntries: LegacyJournalEntry[];
	savedWords: LegacySavedWord[];
	translations: LegacyTranslation[];
}

const backendRoot = path.resolve(process.cwd());
const legacyDataPath = path.resolve(backendRoot, LEGACY_DATABASE_FILE);
const schemaFilePath = path.resolve(backendRoot, "db", "schema.sql");
const uploadsAudioDirectory = path.resolve(backendRoot, AUDIO_DIRECTORY);
const legacyAudioDirectory = path.resolve(backendRoot, LEGACY_AUDIO_DIRECTORY);

export const staticAudioDirectory = uploadsAudioDirectory;

export const db = knex({
	client: "mysql2",
	connection: {
		database: process.env.DB_NAME ?? "jottly",
		dateStrings: true,
		host: process.env.DB_HOST ?? "127.0.0.1",
		password: process.env.DB_PASSWORD ?? "",
		port: Number(process.env.DB_PORT ?? 3306),
		user: process.env.DB_USER ?? "root",
		multipleStatements: true,
	},
	pool: {
		min: 2,
		max: 10,
	},
});

export type DatabaseClient = Knex;

export async function initializeDatabase(): Promise<void> {
	await fs.mkdir(path.dirname(schemaFilePath), { recursive: true });
	await fs.mkdir(uploadsAudioDirectory, { recursive: true });
	await fs.writeFile(schemaFilePath, schemaSql, "utf-8");

	await db.raw(schemaSql);
	await runDatabaseMigrations(db);
	await migrateLegacyAudioFiles();
	await migrateLegacyJsonData();
}

async function migrateLegacyAudioFiles(): Promise<void> {
	try {
		const files = await fs.readdir(legacyAudioDirectory);

		await Promise.all(
			files.map(async (fileName) => {
				const sourcePath = path.resolve(legacyAudioDirectory, fileName);
				const destinationPath = path.resolve(uploadsAudioDirectory, fileName);

				try {
					await fs.access(destinationPath);
				} catch {
					await fs.copyFile(sourcePath, destinationPath);
				}
			}),
		);
	} catch {
		// No legacy audio directory to migrate.
	}
}

async function migrateLegacyJsonData(): Promise<void> {
	try {
		await fs.access(legacyDataPath);
	} catch {
		return;
	}

	const fileContents = await fs.readFile(legacyDataPath, "utf-8");

	if (!fileContents.trim()) {
		return;
	}

	const legacyData = JSON.parse(fileContents) as LegacyDatabaseSchema;

	await db.transaction(async (transaction) => {
		let legacyUserId: number | null = null;

		if (legacyData.journalEntries.length > 0) {
			const existingLegacyUser = (await transaction("users")
				.where({ clerk_user_id: LEGACY_CLERK_USER_ID })
				.first<{ id: number }>("id")) as { id: number } | undefined;

			if (existingLegacyUser) {
				legacyUserId = existingLegacyUser.id;
			} else {
				const insertedLegacyUser = await transaction("users").insert({
					clerk_user_id: LEGACY_CLERK_USER_ID,
					created_at: toMysqlDateTime(new Date()),
					email: null,
				});

				legacyUserId = Number(
					Array.isArray(insertedLegacyUser)
						? insertedLegacyUser[0]
						: insertedLegacyUser,
				);
			}
		}

		if (legacyData.journalEntries.length > 0 && legacyUserId !== null) {
			await transaction("journal_entries")
				.insert(
					legacyData.journalEntries.map((entry) => ({
						content: entry.content,
						created_at: toMysqlDateTime(entry.createdAt),
						id: entry.id,
						title: resolveEntryTitle(entry.title, entry.content),
						user_id: legacyUserId,
					})),
				)
				.onConflict("id")
				.ignore();
		}

		if (legacyData.translations.length > 0 && legacyUserId !== null) {
			await transaction("translations")
				.insert(
					legacyData.translations.map((translation) => ({
						content: translation.content,
						entry_id: translation.entryId,
						id: translation.id,
						language: translation.language,
						user_id: legacyUserId,
					})),
				)
				.onConflict("id")
				.ignore();
		}

		if (legacyData.audios.length > 0 && legacyUserId !== null) {
			await transaction("audio")
				.insert(
					legacyData.audios.map((audio) => ({
						audio_url: audio.audioUrl,
						created_at: toMysqlDateTime(audio.createdAt),
						id: audio.id,
						translation_id: audio.translationId,
						user_id: legacyUserId,
					})),
				)
				.onConflict("id")
				.ignore();
		}

		if (legacyData.savedWords.length > 0 && legacyUserId !== null) {
			await transaction("saved_words")
				.insert(
					legacyData.savedWords.map((savedWord) => ({
						context_sentence: savedWord.contextSentence,
						created_at: toMysqlDateTime(savedWord.createdAt),
						id: savedWord.id,
						translation: savedWord.translation,
						user_id: legacyUserId,
						word: savedWord.word,
					})),
				)
				.onConflict("id")
				.ignore();
		}
	});
}
