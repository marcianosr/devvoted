/**
 * Utility functions for calculating betting and streak multipliers
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

// Streak multiplier increase mapping based on bet percentage
// Conservative (1-25%): +0.2
// Moderate (26-50%): +0.5
// Aggressive (51-100%): +0.8
export const STREAK_MULTIPLIER_INCREASE_MAP = {
	CONSERVATIVE: 0.2, // 1-25%
	MODERATE: 0.5, // 26-50%
	AGGRESSIVE: 0.8, // 51-100%
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
