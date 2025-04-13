import { db } from "@/database/db";
import { eq, desc, and } from "drizzle-orm";
import { userChallengesTable, challengesTable } from "@/database/schema";
import type { Challenge, UserChallengeWithDetails } from "@/types/db";

/**
 * Determines if the current poll should be a Final Boss challenge for the user
 * Final Boss challenges appear every 2 polls
 *
 * @param userId - The ID of the current user
 * @returns The active challenge if this poll should be a Final Boss, null otherwise
 */
export const getChallengeForPoll = async (
	userId: string
): Promise<Challenge | null> => {
	try {
		// Get user's most recent challenge progress
		const userChallenges = await db
			.select()
			.from(userChallengesTable)
			.where(eq(userChallengesTable.user_id, userId))
			.orderBy(desc(userChallengesTable.created_at))
			.limit(1);

		const userChallenge = userChallenges[0];

		// If no previous challenge or polls_since_last_challenge >= 5, return a challenge
		if (!userChallenge || userChallenge.polls_since_last_challenge >= 5) {
			// Get the "Going All In" challenge
			const challenges = await db
				.select()
				.from(challengesTable)
				.where(eq(challengesTable.code, "going_all_in"))
				.limit(1);

			if (challenges.length === 0) {
				console.error("Going All In challenge not found");
				return null;
			}

			const challenge = challenges[0];

			// Reset or create challenge progress
			if (userChallenge) {
				// Reset existing challenge
				await db
					.update(userChallengesTable)
					.set({ polls_since_last_challenge: 0 })
					.where(eq(userChallengesTable.id, userChallenge.id));
			} else {
				// Create new challenge progress
				await db.insert(userChallengesTable).values({
					user_id: userId,
					challenge_id: challenge.id,
					polls_since_last_challenge: 0,
				});
			}

			return challenge;
		}

		// Increment polls_since_last_challenge
		await db
			.update(userChallengesTable)
			.set({
				polls_since_last_challenge:
					userChallenge.polls_since_last_challenge + 1,
			})
			.where(eq(userChallengesTable.id, userChallenge.id));

		return null;
	} catch (error) {
		console.error("Error in getChallengeForPoll:", error);
		return null;
	}
};

/**
 * Gets the active challenge with full details for a user
 *
 * @param userId - The ID of the current user
 * @returns The active challenge with details if found, null otherwise
 */
export const getActiveChallengeWithDetails = async (
	userId: string
): Promise<UserChallengeWithDetails | null> => {
	try {
		const result = await db
			.select({
				...userChallengesTable,
				challenge: challengesTable,
			})
			.from(userChallengesTable)
			.innerJoin(
				challengesTable,
				eq(userChallengesTable.challenge_id, challengesTable.id)
			)
			.where(
				and(
					eq(userChallengesTable.user_id, userId),
					eq(userChallengesTable.polls_since_last_challenge, 0)
				)
			)
			.orderBy(desc(userChallengesTable.created_at))
			.limit(1);

		return result.length > 0 ? result[0] : null;
	} catch (error) {
		console.error("Error in getActiveChallengeWithDetails:", error);
		return null;
	}
};
