import { Module } from '@nestjs/common';
import { RecordingService } from './recording.service';
import { RecordingController } from './recording.controller';
import { UploadService } from '../upload/upload.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [RecordingController],
  providers: [RecordingService, UploadService],
  exports: [RecordingService],
})
export class RecordingModule {}
