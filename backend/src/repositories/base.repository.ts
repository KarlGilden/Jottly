import type { DatabaseClient } from "../plugins/db.js";
import { db } from "../plugins/db.js";

export class BaseRepository {
  protected db: DatabaseClient;

  constructor(database: DatabaseClient = db) {
    this.db = database;
  }
}
