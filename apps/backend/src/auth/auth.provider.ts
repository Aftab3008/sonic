import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin } from 'better-auth/plugins';
import { DB_CONNECTION } from '../db/db.provider';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { additionalUserFields } from '../../db/models/core/user.model';

export const AUTH = 'AUTH';

export function createAuthInstance(db: NodePgDatabase<typeof schema>) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: schema,
    }),
    user: {
      additionalFields: additionalUserFields,
    },
    emailAndPassword: {
      enabled: true,
    },
    plugins: [expo(), admin()],
    trustedOrigins: [
      'sonic://',
      'exp://',
      'exp://**',
      'exp://192.168.*.*:*/**',
      'exp://172.16.*.*:*/**',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
  });
}

export type ServerAuthType = ReturnType<typeof createAuthInstance>;

export const authProvider = {
  provide: AUTH,
  inject: [DB_CONNECTION],
  useFactory: (db: NodePgDatabase<typeof schema>) => {
    return createAuthInstance(db);
  },
};
