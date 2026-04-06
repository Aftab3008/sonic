import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { UploadModule } from '../upload/upload.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [DbModule, UploadModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
