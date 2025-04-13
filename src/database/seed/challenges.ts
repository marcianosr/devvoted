import { db } from "@/database/db";
import { challengesTable } from "@/database/schema";

export const seedChallenges = async () => {
  console.log("🌱 Creating challenges...");

  // Insert the "Going All In" challenge
  await db.insert(challengesTable).values([
    {
      name: "Going All In",
      code: "going_all_in",
      description: "You must bet 100% of your XP on this poll!",
      effect_type: "forced_bet",
    },
  ]).onConflictDoNothing();
};
