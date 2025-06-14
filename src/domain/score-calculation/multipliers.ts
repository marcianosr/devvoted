/**
 * Utility functions for calculating betting and streak multipliers
 * 
 * The Knowledge Score is calculated as: Accuracy × Streak Multiplier × Betting Multiplier
 * 
 * - Streak Multiplier: Accumulates over time as users answer correctly in a category
 *   (e.g., CSS: 0.1 → 0.3 → 0.8 → 1.6). Resets to DEFAULT_MULTIPLIER on wrong answers.
 * 
 * - Betting Multiplier: Based on the user's risk-taking behavior (average bet percentage)
 */

// Betting multiplier mapping based on bet percentage
// Conservative (1-25%): ×1.2
// Moderate (26-50%): ×1.5
// Aggressive (51-100%): ×2.0
export const BETTING_MULTIPLIER_MAP = {
	CONSERVATIVE: 1.2, // 1-25%
	MODERATE: 1.5, // 26-50%
	AGGRESSIVE: 2.0, // 51-100%
};

// Streak multiplier increase mapping based on bet percentage
// Conservative (1-25%): +0.2
// Moderate (26-50%): +0.5
// Aggressive (51-100%): +0.8
export const STREAK_MULTIPLIER_INCREASE_MAP = {
	CONSERVATIVE: 0.2, // 1-25%
	MODERATE: 0.5, // 26-50%
	AGGRESSIVE: 0.8, // 51-100%
};

// Streak multiplier constraints
export const MIN_STREAK_MULTIPLIER = 0.1; // Starting value
export const MAX_STREAK_MULTIPLIER = 10.0; // Maximum possible value

/**
 * Get the betting multiplier based on the bet percentage
 * @param betPercentage - The bet percentage (1-100)
 * @returns The appropriate betting multiplier
 */
export const getBettingMultiplierForBet = (betPercentage: number): number => {
	if (betPercentage <= 25) {
		return BETTING_MULTIPLIER_MAP.CONSERVATIVE;
	} else if (betPercentage <= 50) {
		return BETTING_MULTIPLIER_MAP.MODERATE;
	} else {
		return BETTING_MULTIPLIER_MAP.AGGRESSIVE;
	}
};

/**
 * Get the streak multiplier increase based on the bet percentage
 * @param betPercentage - The bet percentage (1-100)
 * @returns The appropriate streak multiplier increase
 */
export const getStreakMultiplierIncreaseForBet = (betPercentage: number): number => {
	if (betPercentage <= 25) {
		return STREAK_MULTIPLIER_INCREASE_MAP.CONSERVATIVE;
	} else if (betPercentage <= 50) {
		return STREAK_MULTIPLIER_INCREASE_MAP.MODERATE;
	} else {
		return STREAK_MULTIPLIER_INCREASE_MAP.AGGRESSIVE;
	}
};

/**
 * Default multiplier value when a user answers incorrectly or starts fresh
 */
export const DEFAULT_MULTIPLIER = 0.1;
