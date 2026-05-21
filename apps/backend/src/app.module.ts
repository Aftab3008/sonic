import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ContentModule } from './content/content.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DbModule,
    AuthModule,
    AdminModule,
    ContentModule,
    WebhooksModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

