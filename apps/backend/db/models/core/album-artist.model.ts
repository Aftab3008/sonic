import { pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { artist } from './artist.model';
import { album } from './album.model';
import { trackArtistRoleEnum } from './enums.model';

export const albumArtist = pgTable(
  'album_artist',
  {
    albumId: text('album_id')
      .references(() => album.id, { onDelete: 'cascade' })
      .notNull(),
    artistId: text('artist_id')
      .references(() => artist.id, { onDelete: 'cascade' })
      .notNull(),
    role: trackArtistRoleEnum('role').default('PRIMARY').notNull(),
  },
  (t) => [primaryKey({ columns: [t.albumId, t.artistId, t.role] })],
);

export const albumArtistRelations = relations(albumArtist, ({ one }) => ({
  album: one(album, {
    fields: [albumArtist.albumId],
    references: [album.id],
  }),
  artist: one(artist, {
    fields: [albumArtist.artistId],
    references: [artist.id],
  }),
}));
