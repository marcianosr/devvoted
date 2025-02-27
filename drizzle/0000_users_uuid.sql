-- Drop existing foreign key constraints
ALTER TABLE IF EXISTS "polls" DROP CONSTRAINT IF EXISTS "polls_created_by_fkey";
ALTER TABLE IF EXISTS "polls_options" DROP CONSTRAINT IF EXISTS "polls_options_user_id_fkey";

-- Drop existing tables
DROP TABLE IF EXISTS "users" CASCADE;

-- Drop existing types if they exist
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        DROP TYPE roles CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
        DROP TYPE status CASCADE;
    END IF;
END $$;

-- Create types
CREATE TYPE roles AS ENUM ('user', 'admin');
CREATE TYPE status AS ENUM ('draft', 'pending-review', 'needs-revision', 'open', 'closed');

-- Recreate users table with UUID
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY,
    "display_name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "photo_url" TEXT,
    "roles" roles NOT NULL DEFAULT 'user',
    "total_polls_submitted" INTEGER NOT NULL DEFAULT 0
);

-- Update polls table to use UUID for created_by
ALTER TABLE IF EXISTS "polls" 
    ALTER COLUMN "created_by" TYPE UUID USING created_by::UUID,
    ADD CONSTRAINT "polls_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE;
