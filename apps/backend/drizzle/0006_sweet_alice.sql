CREATE TYPE "public"."role" AS ENUM('PRIMARY', 'FEATURED', 'PRODUCER');--> statement-breakpoint
CREATE TABLE "recording" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"title" text NOT NULL,
	"duration_ms" integer,
	"audio_url" text,
	"audio_process_status" "track_audio_status" DEFAULT 'PENDING_UPLOAD' NOT NULL,
	"file_size" bigint,
	"codec" text,
	"bitrate" integer,
	"sample_rate" integer,
	"isrc" text,
	"is_explicit" boolean DEFAULT false NOT NULL,
	"has_lyrics" boolean DEFAULT false NOT NULL,
	"lyrics" text,
	"bpm" integer,
	"key" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recording_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "recording_isrc_unique" UNIQUE("isrc")
);
--> statement-breakpoint
CREATE TABLE "recording_artist" (
	"recording_id" text NOT NULL,
	"artist_id" text NOT NULL,
	"role" "role" DEFAULT 'PRIMARY' NOT NULL,
	CONSTRAINT "recording_artist_recording_id_artist_id_role_pk" PRIMARY KEY("recording_id","artist_id","role")
);
--> statement-breakpoint
ALTER TABLE "track" DROP CONSTRAINT "track_isrc_unique";--> statement-breakpoint
ALTER TABLE "album_artist" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "album_artist" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::text::"public"."role";--> statement-breakpoint
ALTER TABLE "album_artist" ALTER COLUMN "role" SET DEFAULT 'PRIMARY';--> statement-breakpoint
ALTER TABLE "track_artist" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "track_artist" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::text::"public"."role";--> statement-breakpoint
ALTER TABLE "track_artist" ALTER COLUMN "role" SET DEFAULT 'PRIMARY';--> statement-breakpoint
ALTER TABLE "track" ADD COLUMN "recording_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "track" ADD COLUMN "disc_number" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "track" ADD COLUMN "override_title" text;--> statement-breakpoint
ALTER TABLE "track" ADD COLUMN "override_is_explicit" boolean;--> statement-breakpoint
ALTER TABLE "track" ADD COLUMN "cover_image_url" text;--> statement-breakpoint
ALTER TABLE "recording_artist" ADD CONSTRAINT "recording_artist_recording_id_recording_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recording"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recording_artist" ADD CONSTRAINT "recording_artist_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" ADD CONSTRAINT "track_recording_id_recording_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."recording"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "isrc";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "duration_ms";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "audio_url";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "audio_process_status";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "is_explicit";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "bpm";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "has_lyrics";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "lyrics";--> statement-breakpoint
ALTER TABLE "track" DROP COLUMN "release_status";