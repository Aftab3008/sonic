import { Controller, Get, Param, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ConsumerAlbumService } from './consumer-album.service';
import { Roles } from '@thallesp/nestjs-better-auth';

@Controller('api/v1/albums')
@Roles(['admin', 'user'])
export class ConsumerAlbumController {
  constructor(private readonly consumerAlbumService: ConsumerAlbumService) {}

  @Get()
  async getAlbumSummaries(
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ) {
    return this.consumerAlbumService.getAlbumSummaries(limit);
  }

  @Get(':id')
  async getAlbumDetail(@Param('id') albumId: string) {
    return this.consumerAlbumService.getAlbumDetail(albumId);
  }
}
