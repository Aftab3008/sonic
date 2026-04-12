import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { AdminGenreController } from './admin/admin-genre.controller';
import { AdminGenreService } from './admin/admin-genre.service';
import { ConsumerGenreController } from './consumer/consumer-genre.controller';
import { ConsumerGenreService } from './consumer/consumer-genre.service';
import { GenreQueries } from './genre-queries.service';

/**
 * Genre Module
 *
 * Organized using Method 2: Service Layer Split
 * - Admin: Full CRUD
 * - Consumer: Read-only browsing
 */
@Module({
  imports: [DbModule],
  controllers: [AdminGenreController, ConsumerGenreController],
  providers: [AdminGenreService, ConsumerGenreService, GenreQueries],
  exports: [AdminGenreService, ConsumerGenreService],
})
export class GenreModule {}
