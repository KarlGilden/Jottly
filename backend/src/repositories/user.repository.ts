import { BaseRepository } from "./base.repository.js";
import type { User } from "../types/user.types.js";
import { toMysqlDateTime } from "../utils/datetime.js";

interface UserRow {
  id: number;
  clerk_user_id: string;
  email: string | null;
  created_at: string;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    email: row.email,
    createdAt: row.created_at,
  };
}

export class UserRepository extends BaseRepository {
  async findByClerkUserId(clerkUserId: string): Promise<User | null> {
    const row = (await this.db("users")
      .where({ clerk_user_id: clerkUserId })
      .first<UserRow>("id", "clerk_user_id", "email", "created_at")) as UserRow | undefined;

    return row ? mapUser(row) : null;
  }

  async create(clerkUserId: string, email: string | null): Promise<User> {
    const createdAt = toMysqlDateTime(new Date());
    const result = await this.db("users").insert({
      clerk_user_id: clerkUserId,
      created_at: createdAt,
      email,
    });

    const id = Number(Array.isArray(result) ? result[0] : result);
    const user = (await this.db("users")
      .where({ id })
      .first<UserRow>("id", "clerk_user_id", "email", "created_at")) as UserRow | undefined;

    if (!user) {
      throw new Error("User was not created");
    }

    return mapUser(user);
  }

  async updateEmail(id: number, email: string | null): Promise<User | null> {
    const updatedRows = await this.db("users")
      .where({ id })
      .update({
        email,
      });

    if (updatedRows === 0) {
      return null;
    }

    const user = (await this.db("users")
      .where({ id })
      .first<UserRow>("id", "clerk_user_id", "email", "created_at")) as UserRow | undefined;

    return user ? mapUser(user) : null;
  }

  async deleteByClerkUserId(clerkUserId: string): Promise<boolean> {
    const deletedRows = await this.db("users")
      .where({ clerk_user_id: clerkUserId })
      .del();

    return deletedRows > 0;
  }
}
