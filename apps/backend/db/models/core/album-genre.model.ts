import { pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { album } from './album.model';
import { genre } from './genre.model';

export const albumGenre = pgTable(
  'album_genre',
  {
    albumId: text('album_id')
      .references(() => album.id, { onDelete: 'cascade' })
      .notNull(),
    genreId: text('genre_id')
      .references(() => genre.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.albumId, t.genreId] })],
);

export const albumGenreRelations = relations(albumGenre, ({ one }) => ({
  album: one(album, {
    fields: [albumGenre.albumId],
    references: [album.id],
  }),
  genre: one(genre, {
    fields: [albumGenre.genreId],
    references: [genre.id],
  }),
}));
