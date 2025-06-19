import { ActiveRun } from "@/types/db";

export const START_TEMPORARY_XP = 5;
export const GAME_OVER_XP = 0;
export const START_MULTIPLIER_INCREASE = "0.1"; // Decimal value for Postgres

export const startRunSettings: Partial<ActiveRun> = {
	temporary_xp: START_TEMPORARY_XP,
	current_streak: 0,
	streak_multiplier: START_MULTIPLIER_INCREASE,
};
