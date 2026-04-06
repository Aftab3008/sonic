import { pgTable, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { albumArtist } from './album-artist.model';
import { trackArtist } from './track-artist.model';

export const artist = pgTable('artist', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  bio: text('bio'),
  imageUrl: text('image_url'),
  headerImageUrl: text('header_image_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  socialLinks: jsonb('social_links').$type<{ instagram?: string; twitter?: string; website?: string }>(),
  monthlyListeners: integer('monthly_listeners').default(0).notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const artistRelations = relations(artist, ({ many }) => ({
  albums: many(albumArtist),
  tracks: many(trackArtist),
}));
