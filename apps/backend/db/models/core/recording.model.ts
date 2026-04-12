import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  bigint,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { nanoid } from 'nanoid';
import { recordingArtist } from './recording-artist.model';
import { track } from './track.model';
import { trackAudioStatusEnum } from './enums.model';

/**
 * Recording - The actual audio file and its canonical metadata
 * Independent of any album or release context
 */
export const recording = pgTable('recording', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  publicId: text('public_id')
    .unique()
    .notNull()
    .$defaultFn(() => nanoid(14)),

  // Canonical metadata (audio-specific)
  title: text('title').notNull(), // Canonical title of the recording
  durationMs: integer('duration_ms'), // Audio duration in milliseconds
  audioUrl: text('audio_url'), // Audio file location (null until uploaded)
  audioProcessStatus: trackAudioStatusEnum('audio_process_status')
    .default('PENDING_UPLOAD')
    .notNull(),

  // Technical specs
  fileSize: bigint('file_size', { mode: 'number' }),
  codec: text('codec'), // MP3, FLAC, WAV, etc.
  bitrate: integer('bitrate'), // e.g., 320000 for 320kbps
  sampleRate: integer('sample_rate'), // e.g., 44100, 48000

  // Industry identifiers
  isrc: text('isrc').unique(), // International Standard Recording Code
  isExplicit: boolean('is_explicit').default(false).notNull(),
  hasLyrics: boolean('has_lyrics').default(false).notNull(),
  lyrics: text('lyrics'),

  // Musical attributes
  bpm: integer('bpm'),
  key: text('key'), // Musical key (C major, etc.)

  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const recordingRelations = relations(recording, ({ many }) => ({
  artists: many(recordingArtist),
  tracks: many(track),
}));

export type Recording = typeof recording.$inferSelect;
export type NewRecording = typeof recording.$inferInsert;
