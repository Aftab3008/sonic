import { Injectable } from '@nestjs/common';
import { ConsumerAlbumService } from '../../album/consumer/consumer-album.service';
import { ConsumerTrackService } from '../../track/consumer/consumer-track.service';
import { ConsumerGenreService } from '../../genre/consumer/consumer-genre.service';

@Injectable()
export class ConsumerDiscoveryService {
  constructor(
    private readonly albumService: ConsumerAlbumService,
    private readonly trackService: ConsumerTrackService,
    private readonly consumerGenreService: ConsumerGenreService,
  ) {}

  async getHomeDiscovery() {
    const [featuredArr, recent, singles, albums] = await Promise.all([
      this.albumService.getAlbumSummaries(1),
      this.trackService.getTracks(6),
      this.albumService.getAlbumSummaries(8, ['SINGLE']),
      this.albumService.getAlbumSummaries(8, ['ALBUM', 'EP', 'COMPILATION']),
    ]);

    return {
      featured: featuredArr[0] ?? null,
      recent,
      singles,
      albums,
    };
  }

  async getGenres() {
    return await this.consumerGenreService.getGenres();
  }

  async getGenreDetails(slug: string) {
    return await this.consumerGenreService.getGenreDetails(slug);
  }
}
