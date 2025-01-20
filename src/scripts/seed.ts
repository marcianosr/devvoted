import { seedDatabase } from "@/database/seed";

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("✨ Database seeded successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  });
