import { pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { artist } from './artist.model';
import { track } from './track.model';
import { roleEnum } from './enums.model';

export const trackArtist = pgTable(
  'track_artist',
  {
    trackId: text('track_id')
      .references(() => track.id, { onDelete: 'cascade' })
      .notNull(),
    artistId: text('artist_id')
      .references(() => artist.id, { onDelete: 'cascade' })
      .notNull(),
    role: roleEnum('role').default('PRIMARY').notNull(),
  },
  (t) => [primaryKey({ columns: [t.trackId, t.artistId, t.role] })],
);

export const trackArtistRelations = relations(trackArtist, ({ one }) => ({
  track: one(track, {
    fields: [trackArtist.trackId],
    references: [track.id],
  }),
  artist: one(artist, {
    fields: [trackArtist.artistId],
    references: [artist.id],
  }),
}));
