import { pgTable, text, timestamp, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { nanoid } from 'nanoid';
import { albumArtist } from './album-artist.model';
import { albumGenre } from './album-genre.model';
import { track } from './track.model';
import { albumTypeEnum, releaseStatusEnum } from './enums.model';

export const album = pgTable('album', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  publicId: text('public_id')
    .unique()
    .notNull()
    .$defaultFn(() => nanoid(14)),
  title: text('title').notNull(),
  albumType: albumTypeEnum('album_type').default('ALBUM').notNull(),
  releaseStatus: releaseStatusEnum('release_status').default('DRAFT').notNull(),
  coverImageUrl: text('cover_image_url'),
  releaseDate: date('release_date').notNull(),
  upc: text('upc').unique(),
  recordLabel: text('record_label'),
  copyright: text('copyright'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const albumRelations = relations(album, ({ many }) => ({
  artists: many(albumArtist),
  tracks: many(track),
  genres: many(albumGenre),
}));
