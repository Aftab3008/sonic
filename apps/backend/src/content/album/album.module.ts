import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { AdminAlbumController } from './admin/admin-album.controller';
import { AdminAlbumService } from './admin/admin-album.service';
import { ConsumerAlbumController } from './consumer/consumer-album.controller';
import { ConsumerAlbumService } from './consumer/consumer-album.service';
import { AlbumQueries } from './album-queries.service';

/**
 * Album Module
 *
 * Organized using Method 2: Service Layer Split
 * - Admin: Full CRUD, all albums, internal fields
 * - Consumer: Read-only, released albums only, sanitized output
 */
@Module({
  imports: [DbModule],
  controllers: [AdminAlbumController, ConsumerAlbumController],
  providers: [AdminAlbumService, ConsumerAlbumService, AlbumQueries],
  exports: [AdminAlbumService, ConsumerAlbumService],
})
export class AlbumModule {}
