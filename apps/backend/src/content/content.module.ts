import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [GenreModule, ArtistModule, AlbumModule, TrackModule, UploadModule],
  exports: [GenreModule, ArtistModule, AlbumModule, TrackModule, UploadModule],
})
export class ContentModule {}
