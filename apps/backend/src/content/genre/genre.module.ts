import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
  imports: [DbModule],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
