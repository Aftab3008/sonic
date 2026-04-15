import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { v7 as uuidv7 } from 'uuid';
import { album } from './album.model';
import { recording } from './recording.model';
import { trackArtist } from './track-artist.model';

/**
 * Track - A Recording in context of an Album
 * Contains context-specific metadata that may override the recording
 */
export const track = pgTable('track', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  publicId: text('public_id')
    .unique()
    .notNull()
    .$defaultFn(() => nanoid(14)),
  albumId: text('album_id')
    .references(() => album.id, { onDelete: 'cascade' })
    .notNull(),
  recordingId: text('recording_id')
    .references(() => recording.id, { onDelete: 'cascade' })
    .notNull(),
  trackNumber: integer('track_number').notNull(),
  discNumber: integer('disc_number').default(1).notNull(),

  overrideTitle: text('override_title'), // Different title in this album context
  overrideIsExplicit: boolean('override_is_explicit'), // Override explicit flag
  coverImageUrl: text('cover_image_url'),
  playCount: bigint('play_count', { mode: 'number' }).default(0).notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const trackRelations = relations(track, ({ one, many }) => ({
  recording: one(recording, {
    fields: [track.recordingId],
    references: [recording.id],
  }),
  album: one(album, {
    fields: [track.albumId],
    references: [album.id],
  }),
  artists: many(trackArtist),
}));

export type Track = typeof track.$inferSelect;
export type NewTrack = typeof track.$inferInsert;
