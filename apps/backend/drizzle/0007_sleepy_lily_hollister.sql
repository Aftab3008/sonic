ALTER TABLE "recording" ADD COLUMN "batch_job_id" text;--> statement-breakpoint
ALTER TABLE "recording" ADD CONSTRAINT "recording_batch_job_id_unique" UNIQUE("batch_job_id");