type XPCalculationParams = {
	availableXP: number;
	betPercentage: number;
	streakMultiplier: number;
};

export const calculateBetXP = ({
	availableXP,
	betPercentage,
	streakMultiplier,
}: XPCalculationParams) => {
	// Calculate bet XP based on percentage
	const betXP = Math.floor(availableXP * (betPercentage / 100));

	// Calculate bonus XP from multiplier
	const multiplierBonus = Math.floor(betXP * streakMultiplier);

	// Calculate total XP
	const totalXP = betXP + multiplierBonus;

	return {
		betXP,
		multiplierBonus,
		totalXP,
	};
};
