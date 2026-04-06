import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  bigint,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { nanoid } from 'nanoid';
import { album } from './album.model';
import { trackArtist } from './track-artist.model';
import { releaseStatusEnum, trackAudioStatusEnum } from './enums.model';

export const track = pgTable('track', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  publicId: text('public_id')
    .unique()
    .notNull()
    .$defaultFn(() => nanoid(14)),
  title: text('title').notNull(),
  albumId: text('album_id')
    .references(() => album.id, { onDelete: 'cascade' })
    .notNull(),
  isrc: text('isrc').unique(),
  durationMs: integer('duration_ms'),
  trackNumber: integer('track_number').notNull(),
  audioUrl: text('audio_url'),
  audioProcessStatus: trackAudioStatusEnum('audio_process_status')
    .default('PENDING_UPLOAD')
    .notNull(),
  isExplicit: boolean('is_explicit').default(false).notNull(),
  playCount: bigint('play_count', { mode: 'number' }).default(0).notNull(),
  bpm: integer('bpm'),
  hasLyrics: boolean('has_lyrics').default(false).notNull(),
  lyrics: text('lyrics'),
  releaseStatus: releaseStatusEnum('release_status').default('DRAFT').notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const trackRelations = relations(track, ({ one, many }) => ({
  album: one(album, {
    fields: [track.albumId],
    references: [album.id],
  }),
  artists: many(trackArtist),
}));
