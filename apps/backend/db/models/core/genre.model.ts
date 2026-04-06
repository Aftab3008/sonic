import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { albumGenre } from './album-genre.model';

export const genre = pgTable('genre', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  primaryColor: text('primary_color'),
  secondaryColor: text('secondary_color'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const genreRelations = relations(genre, ({ many }) => ({
  albums: many(albumGenre),
}));
