import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { AdminArtistController } from './admin/admin-artist.controller';
import { AdminArtistService } from './admin/admin-artist.service';
import { ConsumerArtistController } from './consumer/consumer-artist.controller';
import { ConsumerArtistService } from './consumer/consumer-artist.service';
import { ArtistQueries } from './artist-queries.service';

/**
 * Artist Module
 *
 * Organized using Method 2: Service Layer Split
 * - Admin: Full CRUD, all artists, internal fields
 * - Consumer: Read-only, verified artists, sanitized output
 */
@Module({
  imports: [DbModule],
  controllers: [AdminArtistController, ConsumerArtistController],
  providers: [AdminArtistService, ConsumerArtistService, ArtistQueries],
  exports: [AdminArtistService, ConsumerArtistService],
})
export class ArtistModule {}
