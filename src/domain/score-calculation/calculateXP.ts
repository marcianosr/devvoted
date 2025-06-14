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
	const betXP = Math.floor(availableXP * (betPercentage / 100));
	const multiplierBonus = Math.floor(betXP * streakMultiplier);
	const totalXP = betXP + multiplierBonus;

	console.log(
		`Bet XP: ${betXP} x Multiplier Bonus: ${multiplierBonus} = Total XP: ${totalXP}`
	);

	return {
		betXP,
		multiplierBonus,
		totalXP,
	};
};
