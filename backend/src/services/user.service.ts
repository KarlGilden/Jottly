import { UserRepository } from "../repositories/user.repository.js";
import type { User } from "../types/user.types.js";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserByClerkId(clerkUserId: string): Promise<User | null> {
    return this.userRepository.findByClerkUserId(clerkUserId);
  }

  async deleteUser(clerkUserId: string): Promise<boolean> {
    return this.userRepository.deleteByClerkUserId(clerkUserId);
  }

  async syncUserFromClerk(clerkData: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
  }): Promise<User> {
    const clerkUserId = clerkData.id;
    const email = clerkData.email_addresses[0]?.email_address ?? null;
    const existingUser = await this.userRepository.findByClerkUserId(clerkUserId);

    if (existingUser) {
      if (existingUser.email !== email) {
        const updatedUser = await this.userRepository.updateEmail(existingUser.id, email);

        if (!updatedUser) {
          throw new Error("Failed to update user");
        }

        return updatedUser;
      }

      return existingUser;
    }

    return this.userRepository.create(clerkUserId, email);
  }
}
