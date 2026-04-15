import { Module } from '@nestjs/common';
import { RecordingModule } from '../content/recording/recording.module';
import { ConfigModule } from '@nestjs/config';
import { AwsWebhooksModule } from './aws/aws.module';

@Module({
  imports: [ConfigModule, RecordingModule, AwsWebhooksModule],
})
export class WebhooksModule {}
