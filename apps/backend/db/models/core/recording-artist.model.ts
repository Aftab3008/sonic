import { pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { recording } from './recording.model';
import { artist } from './artist.model';
import { roleEnum } from './enums.model';

/**
 * RecordingArtist - Junction table for recording performers
 * These are the actual artists who performed on the recording
 */
export const recordingArtist = pgTable(
  'recording_artist',
  {
    recordingId: text('recording_id')
      .references(() => recording.id, { onDelete: 'cascade' })
      .notNull(),
    artistId: text('artist_id')
      .references(() => artist.id, { onDelete: 'cascade' })
      .notNull(),
    role: roleEnum('role').default('PRIMARY').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.recordingId, table.artistId, table.role],
    }),
  ],
);

export const recordingArtistRelations = relations(
  recordingArtist,
  ({ one }) => ({
    recording: one(recording, {
      fields: [recordingArtist.recordingId],
      references: [recording.id],
    }),
    artist: one(artist, {
      fields: [recordingArtist.artistId],
      references: [artist.id],
    }),
  }),
);

export type RecordingArtist = typeof recordingArtist.$inferSelect;
export type NewRecordingArtist = typeof recordingArtist.$inferInsert;
