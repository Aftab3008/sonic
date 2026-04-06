import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { user } from '../core/user.model';

export const session = pgTable('session', {
  id: t.text('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: t.varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: t
    .timestamp('expires_at', { precision: 6, withTimezone: true })
    .notNull(),
  ipAddress: t.text('ip_address'),
  userAgent: t.text('user_agent'),
  createdAt: t
    .timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull(),
  impersonatedBy: t.text('impersonated_by'),
});
