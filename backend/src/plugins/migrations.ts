import type { Knex } from "knex";

import { toMysqlDateTime } from "../utils/datetime.js";
import { authAndTitleMigration } from "./migrations/20260415_auth_and_title.js";

interface MigrationDefinition {
  name: string;
  up: (db: Knex) => Promise<void>;
}

const migrations: MigrationDefinition[] = [authAndTitleMigration];

async function uniqueIndexExists(db: Knex, tableName: string, columnName: string): Promise<boolean> {
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

export async function runDatabaseMigrations(db: Knex): Promise<void> {
  const hasSchemaMigrationsTable = await db.schema.hasTable("schema_migrations");

  if (!hasSchemaMigrationsTable) {
    await db.schema.createTable("schema_migrations", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.dateTime("applied_at", { precision: 3 }).notNullable();
      table.unique(["name"], "schema_migrations_name_unique");
    });
  } else if (!(await uniqueIndexExists(db, "schema_migrations", "name"))) {
    await db.schema.alterTable("schema_migrations", (table) => {
      table.unique(["name"], "schema_migrations_name_unique");
    });
  }

  for (const migration of migrations) {
    const existingMigration = await db("schema_migrations")
      .where({ name: migration.name })
      .first<{ id: number }>("id");

    if (existingMigration) {
      continue;
    }

    await db.transaction(async (transaction) => {
      await migration.up(transaction);
      await transaction("schema_migrations").insert({
        applied_at: toMysqlDateTime(new Date()),
        name: migration.name,
      });
    });
  }
}
