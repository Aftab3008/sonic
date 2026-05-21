import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DbModule } from '../db/db.module';
import { SearchModule } from '../search/search.module';
import { AdminSearchController } from './search-admin.controller';

@Module({
  imports: [AuthModule, DbModule, SearchModule],
  controllers: [AdminController, AdminSearchController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

