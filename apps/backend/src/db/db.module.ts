import { Module } from '@nestjs/common';
import { drizzleProvider, DB_CONNECTION } from './db.provider';

@Module({
  providers: [...drizzleProvider],
  exports: [DB_CONNECTION],
})
export class DbModule {}
