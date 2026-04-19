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
    const topAlbums = await this.albumService.getAlbums(1);
    const featuredAlbumSummary = topAlbums[0];

    let featured;
    if (featuredAlbumSummary) {
      const fullFeatured = await this.albumService.getAlbumById(
        featuredAlbumSummary.id,
      );
      if (fullFeatured) {
        featured = {
          ...fullFeatured,
          tracks: fullFeatured.tracks?.slice(0, 1) || [],
        };
      }
    }

    const recent = await this.trackService.getTracks(6);

    const madeForYou = await this.albumService.getAlbums(6);

    return {
      featured,
      recent,
      madeForYou,
    };
  }
}
