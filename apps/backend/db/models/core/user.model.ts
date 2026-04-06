import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: t.text('id').primaryKey(),
  name: t.text('name').notNull(),
  email: t.varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: t.boolean('email_verified').notNull(),
  image: t.text('image'),
  createdAt: t
    .timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull(),
  role: t.text('role', { enum: ['user', 'admin'] }).default('user'),
  lang: t.text('lang').default('en'),
  termsAccepted: t.boolean('terms_accepted').notNull().default(false),
  banned: t.boolean('banned').default(false),
  banReason: t.text('ban_reason'),
  banExpires: t.timestamp('ban_expires', {
    precision: 6,
    withTimezone: true,
  }),
});

export type User = typeof user.$inferSelect;

export const additionalUserFields = {
  role: {
    type: ['user', 'admin'],
    required: false,
    defaultValue: 'user',
    input: false,
  },
  lang: {
    type: 'string' as const,
    required: false,
    defaultValue: 'en',
  },
  termsAccepted: {
    type: 'boolean' as const,
    required: false,
    defaultValue: false,
  },
};
