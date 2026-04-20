import type { Knex } from "knex";

import { LEGACY_CLERK_USER_ID } from "../../utils/constants.js";
import { resolveEntryTitle } from "../../utils/title.js";

const USERS_TABLE = "users";
const JOURNAL_ENTRIES_TABLE = "journal_entries";

async function indexExists(db: Knex, tableName: string, indexName: string): Promise<boolean> {
  const databaseName = process.env.DB_NAME ?? "jottly";
  const result = await db("information_schema.statistics")
    .where({
      index_name: indexName,
      table_name: tableName,
      table_schema: databaseName,
    })
    .first("index_name");

  return Boolean(result);
}

async function uniqueIndexExistsOnColumn(db: Knex, tableName: string, columnName: string): Promise<boolean> {
  const databaseName = process.env.DB_NAME ?? "jottly";
  const result = await db("information_schema.statistics")
    .where({
      column_name: columnName,
      non_unique: 0,
      table_name: tableName,
      table_schema: databaseName,
    })
    .first("index_name");

  return Boolean(result);
}

export const authAndTitleMigration = {
  name: "20260415_auth_and_title",
  async up(db: Knex): Promise<void> {
    const hasUsersTable = await db.schema.hasTable(USERS_TABLE);

    if (hasUsersTable) {
      const hasClerkUserId = await db.schema.hasColumn(USERS_TABLE, "clerk_user_id");
      const hasEmail = await db.schema.hasColumn(USERS_TABLE, "email");
      const hasCreatedAt = await db.schema.hasColumn(USERS_TABLE, "created_at");

      if (!hasClerkUserId) {
        await db.schema.alterTable(USERS_TABLE, (table) => {
          table.string("clerk_user_id", 255).nullable();
        });
      }

      if (!hasEmail) {
        await db.schema.alterTable(USERS_TABLE, (table) => {
          table.string("email", 255).nullable();
        });
      }

      if (!hasCreatedAt) {
        await db.schema.alterTable(USERS_TABLE, (table) => {
          table.dateTime("created_at", { precision: 3 }).nullable();
        });
      }

      const usersNeedingClerkIds = (await db(USERS_TABLE)
        .whereNull("clerk_user_id")
        .orWhere("clerk_user_id", "")
        .select<{ id: number }[]>("id")) as Array<{ id: number }>;

      for (const user of usersNeedingClerkIds) {
        const legacyClerkUserId =
          user.id === 1 ? LEGACY_CLERK_USER_ID : `${LEGACY_CLERK_USER_ID}_${user.id}`;

        await db(USERS_TABLE)
          .where({ id: user.id })
          .update({
            clerk_user_id: legacyClerkUserId,
          });
      }

      await db(USERS_TABLE)
        .whereNull("created_at")
        .update({
          created_at: db.fn.now(),
        });

      await db.schema.alterTable(USERS_TABLE, (table) => {
        table.string("clerk_user_id", 255).notNullable().alter();
        table.dateTime("created_at", { precision: 3 }).notNullable().alter();
      });

      if (!(await uniqueIndexExistsOnColumn(db, USERS_TABLE, "clerk_user_id"))) {
        await db.schema.alterTable(USERS_TABLE, (table) => {
          table.unique(["clerk_user_id"], "users_clerk_user_id_unique");
        });
      }

      if (!(await indexExists(db, USERS_TABLE, "idx_users_clerk_user_id"))) {
        await db.schema.alterTable(USERS_TABLE, (table) => {
          table.index(["clerk_user_id"], "idx_users_clerk_user_id");
        });
      }
    }

    const hasJournalEntriesTable = await db.schema.hasTable(JOURNAL_ENTRIES_TABLE);

    if (!hasJournalEntriesTable) {
      return;
    }

    const hasTitle = await db.schema.hasColumn(JOURNAL_ENTRIES_TABLE, "title");

    if (!hasTitle) {
      await db.schema.alterTable(JOURNAL_ENTRIES_TABLE, (table) => {
        table.string("title", 20).nullable();
      });
    }

    const entriesNeedingTitles = (await db(JOURNAL_ENTRIES_TABLE)
      .whereNull("title")
      .orWhere("title", "")
      .select<{ id: number; content: string; title: string | null }[]>("id", "content", "title")) as Array<{
      id: number;
      content: string;
      title: string | null;
    }>;

    for (const entry of entriesNeedingTitles) {
      await db(JOURNAL_ENTRIES_TABLE)
        .where({ id: entry.id })
        .update({
          title: resolveEntryTitle(entry.title ?? undefined, entry.content),
        });
    }

    await db.schema.alterTable(JOURNAL_ENTRIES_TABLE, (table) => {
      table.string("title", 20).notNullable().alter();
    });
  },
};
