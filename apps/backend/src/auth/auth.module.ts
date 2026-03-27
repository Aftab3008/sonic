import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AUTH, authProvider } from './auth.provider';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { DB_CONNECTION } from '../db/db.provider';
import { createAuthInstance } from './auth.provider';

@Module({
  imports: [
    DbModule,
    BetterAuthModule.forRootAsync({
      imports: [DbModule],
      inject: [DB_CONNECTION],
      useFactory: (db) => ({
        auth: createAuthInstance(db),
      }),
    }),
  ],
  providers: [authProvider],
  exports: [AUTH, BetterAuthModule],
})
export class AuthModule {}
