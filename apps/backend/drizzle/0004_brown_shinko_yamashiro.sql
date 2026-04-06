CREATE TYPE "public"."album_type" AS ENUM('ALBUM', 'SINGLE', 'EP', 'COMPILATION');--> statement-breakpoint
CREATE TYPE "public"."release_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."track_artist_role" AS ENUM('PRIMARY', 'FEATURED', 'PRODUCER');--> statement-breakpoint
CREATE TABLE "artist" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"bio" text,
	"image_url" text,
	"header_image_url" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"social_links" jsonb,
	"monthly_listeners" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artist_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "album" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"title" text NOT NULL,
	"album_type" "album_type" DEFAULT 'ALBUM' NOT NULL,
	"release_status" "release_status" DEFAULT 'DRAFT' NOT NULL,
	"cover_image_url" text,
	"release_date" date NOT NULL,
	"upc" text,
	"record_label" text,
	"copyright" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "album_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "album_upc_unique" UNIQUE("upc")
);
--> statement-breakpoint
CREATE TABLE "album_artist" (
	"album_id" text NOT NULL,
	"artist_id" text NOT NULL,
	"role" "track_artist_role" DEFAULT 'PRIMARY' NOT NULL,
	CONSTRAINT "album_artist_album_id_artist_id_role_pk" PRIMARY KEY("album_id","artist_id","role")
);
--> statement-breakpoint
CREATE TABLE "track" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"title" text NOT NULL,
	"album_id" text NOT NULL,
	"isrc" text,
	"duration_ms" integer NOT NULL,
	"track_number" integer NOT NULL,
	"audio_url" text NOT NULL,
	"is_explicit" boolean DEFAULT false NOT NULL,
	"play_count" bigint DEFAULT 0 NOT NULL,
	"bpm" integer,
	"has_lyrics" boolean DEFAULT false NOT NULL,
	"lyrics" text,
	"release_status" "release_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "track_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "track_isrc_unique" UNIQUE("isrc")
);
--> statement-breakpoint
CREATE TABLE "track_artist" (
	"track_id" text NOT NULL,
	"artist_id" text NOT NULL,
	"role" "track_artist_role" DEFAULT 'FEATURED' NOT NULL,
	CONSTRAINT "track_artist_track_id_artist_id_role_pk" PRIMARY KEY("track_id","artist_id","role")
);
--> statement-breakpoint
CREATE TABLE "genre" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"primary_color" text,
	"secondary_color" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "genre_name_unique" UNIQUE("name"),
	CONSTRAINT "genre_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "album_genre" (
	"album_id" text NOT NULL,
	"genre_id" text NOT NULL,
	CONSTRAINT "album_genre_album_id_genre_id_pk" PRIMARY KEY("album_id","genre_id")
);
--> statement-breakpoint
ALTER TABLE "album_artist" ADD CONSTRAINT "album_artist_album_id_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_artist" ADD CONSTRAINT "album_artist_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" ADD CONSTRAINT "track_album_id_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_artist" ADD CONSTRAINT "track_artist_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_artist" ADD CONSTRAINT "track_artist_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_genre" ADD CONSTRAINT "album_genre_album_id_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_genre" ADD CONSTRAINT "album_genre_genre_id_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("id") ON DELETE cascade ON UPDATE no action;