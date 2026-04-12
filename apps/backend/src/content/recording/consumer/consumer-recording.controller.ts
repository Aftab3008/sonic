import { Controller, Get, Param } from '@nestjs/common';
import { ConsumerRecordingService } from './consumer-recording.service';

/**
 * Consumer Recording Controller
 *
 * Limited endpoints for recording access.
 * Most consumer interaction is through Tracks.
 * Routes: /api/v1/recordings
 */
@Controller('api/v1/recordings')
export class ConsumerRecordingController {
  constructor(
    private readonly consumerRecordingService: ConsumerRecordingService,
  ) {}
}
