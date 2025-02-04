ALTER TABLE "polls" ALTER COLUMN "opening_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "closing_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "polls_options" ADD COLUMN "is_correct" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "polls_options" DROP COLUMN "votes";