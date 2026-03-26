import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { user } from '../core/user.model';

export const account = pgTable('account', {
  id: t.text('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: t.text('account_id').notNull(),
  providerId: t.text('provider_id').notNull(),
  accessToken: t.text('access_token'),
  refreshToken: t.text('refresh_token'),
  accessTokenExpiresAt: t.timestamp('access_token_expires_at', {
    precision: 6,
    withTimezone: true,
  }),
  refreshTokenExpiresAt: t.timestamp('refresh_token_expires_at', {
    precision: 6,
    withTimezone: true,
  }),
  scope: t.text('scope'),
  idToken: t.text('id_token'),
  password: t.text('password'),
  createdAt: t
    .timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull(),
  updatedAt: t
    .timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull(),
});
