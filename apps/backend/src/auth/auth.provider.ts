import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin, bearer } from 'better-auth/plugins';
import { DB_CONNECTION } from '../db/db.provider';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { additionalUserFields } from '../../db/models/core/user.model';
import { Logger } from '@nestjs/common';
import { createAuthMiddleware } from 'better-auth/api';

export const AUTH = 'AUTH';

const logger = new Logger('BetterAuth');

const maskSensitiveData = (data: any) => {
  if (!data || typeof data !== 'object') return data;
  const masked = { ...data };
  const sensitiveFields = [
    'password',
    'newPassword',
    'currentPassword',
    'token',
    'clientSecret',
  ];
  for (const field of sensitiveFields) {
    if (field in masked) masked[field] = '********';
  }
  return masked;
};

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
    plugins: [expo(), bearer(), admin()],
    trustedOrigins: [
      'sonic://',
      'exp://',
      'exp://**',
      'exp://192.168.*.*:*/**',
      'exp://172.16.*.*:*/**',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    // hooks: {
    //   before: createAuthMiddleware(async (ctx) => {
    //     if (!ctx.request) return;

    //     const headers: Record<string, string> = {};
    //     if (ctx.headers) {
    //       ctx.headers.forEach((value, key) => {
    //         if (
    //           !['authorization', 'cookie', 'set-cookie'].includes(
    //             key.toLowerCase(),
    //           )
    //         ) {
    //           headers[key] = value;
    //         } else {
    //           headers[key] = '[REDACTED]';
    //         }
    //       });
    //     }

    //     logger.log(`[Request] ${ctx.request.method} ${ctx.path}`, {
    //       headers,
    //       body: ctx.body ? maskSensitiveData(ctx.body) : undefined,
    //     });
    //   }),
    //   after: createAuthMiddleware(async (ctx) => {
    //     const returned = (ctx as any).returned;
    //     let status = 200;
    //     let error = null;

    //     if (returned instanceof Response) {
    //       status = returned.status;
    //     } else if (returned && typeof returned === 'object') {
    //       if (returned.error) {
    //         error = returned.error;
    //         status = returned.error.status || 400;
    //       }
    //     }

    //     const logData = {
    //       path: ctx.path,
    //       status,
    //       method: ctx.request?.method,
    //       error,
    //       data:
    //         returned instanceof Response
    //           ? '[Raw Response]'
    //           : maskSensitiveData(returned),
    //     };

    //     if (error || status >= 400) {
    //       logger.error(`[Response] ${status} ${ctx.path}`, logData);
    //     } else {
    //       logger.log(`[Response] ${status} ${ctx.path}`, logData);
    //     }
    //     logger.log('Context: ', { ...ctx });
    //   }),
    // },
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
