CREATE TYPE "public"."track_audio_status" AS ENUM('PENDING_UPLOAD', 'UPLOADED', 'PROCESSING', 'SUCCEEDED', 'FAILED');--> statement-breakpoint
ALTER TABLE "track" ALTER COLUMN "duration_ms" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "track" ALTER COLUMN "audio_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "track" ADD COLUMN "audio_process_status" "track_audio_status" DEFAULT 'PENDING_UPLOAD' NOT NULL;