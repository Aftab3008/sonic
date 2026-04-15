import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecordingModule } from '../../content/recording/recording.module';
import { AwsWebhookGuard } from './aws.guard';
import { AwsWebhooksController } from './aws.controller';

@Module({
  imports: [ConfigModule, RecordingModule],
  controllers: [AwsWebhooksController],
  providers: [AwsWebhookGuard],
  exports: [AwsWebhookGuard],
})
export class AwsWebhooksModule {}
