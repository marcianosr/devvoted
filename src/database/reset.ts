import { db } from "./db";
import { sql } from "drizzle-orm";

async function resetDatabase() {
    console.log("🗑️  Dropping all tables...");
    
    try {
        await db.execute(sql`
            DROP TABLE IF EXISTS polls_categories CASCADE;
            DROP TABLE IF EXISTS polls_options CASCADE;
            DROP TABLE IF EXISTS polls_response_options CASCADE;
            DROP TABLE IF EXISTS polls_responses CASCADE;
            DROP TABLE IF EXISTS polls CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS __drizzle_migrations CASCADE;
        `);
        
        console.log("✅ All tables dropped successfully!");
    } catch (error) {
        console.error("❌ Error dropping tables:", error);
        throw error;
    }
}

resetDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
