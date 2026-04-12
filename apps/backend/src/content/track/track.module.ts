import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { UploadModule } from '../upload/upload.module';
import { AdminTrackController } from './admin/admin-track.controller';
import { AdminTrackService } from './admin/admin-track.service';
import { ConsumerTrackController } from './consumer/consumer-track.controller';
import { ConsumerTrackService } from './consumer/consumer-track.service';
import { TrackQueries } from './track-queries.service';

/**
 * Track Module
 *
 * Organized using Method 2: Service Layer Split
 * - Admin: Full CRUD, track management
 * - Consumer: Streaming, browsing, popular tracks
 */
@Module({
  imports: [DbModule, UploadModule],
  controllers: [AdminTrackController, ConsumerTrackController],
  providers: [AdminTrackService, ConsumerTrackService, TrackQueries],
  exports: [AdminTrackService, ConsumerTrackService],
})
export class TrackModule {}
