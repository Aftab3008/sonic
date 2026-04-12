import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { RecordingModule } from './recording/recording.module';
import { TrackModule } from './track/track.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    GenreModule,
    ArtistModule,
    AlbumModule,
    RecordingModule,
    TrackModule,
    UploadModule,
  ],
  exports: [
    GenreModule,
    ArtistModule,
    AlbumModule,
    RecordingModule,
    TrackModule,
    UploadModule,
  ],
})
export class ContentModule {}
