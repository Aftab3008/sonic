import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AwsWebhookGuard } from './aws.guard';
import { AdminRecordingService } from '../../content/recording/admin/admin-recording.service';

@Controller('api/webhooks/aws')
@AllowAnonymous()
@UseGuards(AwsWebhookGuard)
export class AwsWebhooksController {
  constructor(private readonly recordingService: AdminRecordingService) {}

  /**
   * Register a Batch Job ID for a recording
   * Called by the Trigger Lambda immediately after submitting a job
   */
  @Post('register-job')
  @HttpCode(HttpStatus.OK)
  async registerJob(@Body() data: { recordingId: string; jobId: string }) {
    await this.recordingService.updateBatchJobId(data.recordingId, data.jobId);
    return { success: true };
  }

  /**
   * Update recording status based on Batch Job State Change
   * Called by the Signer Lambda (via EventBridge)
   */
  @Post('audio-status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Body() data: { jobId: string; status: string }) {
    let internalStatus: 'PROCESSING' | 'SUCCEEDED' | 'FAILED';

    switch (data.status) {
      case 'RUNNING':
      case 'STARTING':
        internalStatus = 'PROCESSING';
        break;
      case 'SUCCEEDED':
        internalStatus = 'SUCCEEDED';
        break;
      case 'FAILED':
        internalStatus = 'FAILED';
        break;
      default:
        return { success: true, message: 'Status ignored' };
    }

    await this.recordingService.updateAudioStatusByBatchJobId(
      data.jobId,
      internalStatus,
    );

    return { success: true };
  }
}
