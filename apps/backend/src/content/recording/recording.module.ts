import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { AdminRecordingController } from './admin/admin-recording.controller';
import { AdminRecordingService } from './admin/admin-recording.service';
import { ConsumerRecordingController } from './consumer/consumer-recording.controller';
import { ConsumerRecordingService } from './consumer/consumer-recording.service';
import { RecordingQueries } from './recording-queries.service';
import { UploadService } from '../upload/upload.service';

/**
 * Recording Module
 *
 * Organized using Method 2: Service Layer Split
 * - Admin: Full CRUD, audio management
 * - Consumer: Limited access for playback only
 */
@Module({
  imports: [DbModule],
  controllers: [AdminRecordingController, ConsumerRecordingController],
  providers: [
    AdminRecordingService,
    ConsumerRecordingService,
    RecordingQueries,
    UploadService,
  ],
  exports: [AdminRecordingService, ConsumerRecordingService],
})
export class RecordingModule {}
