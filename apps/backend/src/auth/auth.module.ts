import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AUTH, authProvider } from './auth.provider';

@Module({
  imports: [DbModule],
  providers: [authProvider],
  exports: [AUTH],
})
export class AuthModule {}
