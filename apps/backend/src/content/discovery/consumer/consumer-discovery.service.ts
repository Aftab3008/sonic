import { Injectable } from '@nestjs/common';
import { ConsumerAlbumService } from '../../album/consumer/consumer-album.service';
import { ConsumerTrackService } from '../../track/consumer/consumer-track.service';

@Injectable()
export class ConsumerDiscoveryService {
  constructor(
    private readonly albumService: ConsumerAlbumService,
    private readonly trackService: ConsumerTrackService,
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
}
