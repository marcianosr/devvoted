CREATE TYPE "public"."status" AS ENUM('draft', 'pending-review', 'needs-revision', 'open', 'closed');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "status" SET DATA TYPE status;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DATA TYPE roles;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "opening_time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "closing_time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "created_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "updated_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE "polls" DROP COLUMN "title";