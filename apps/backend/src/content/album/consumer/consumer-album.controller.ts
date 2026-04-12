import { Controller, Get, Param } from '@nestjs/common';
import { ConsumerAlbumService } from './consumer-album.service';
import { Roles } from '@thallesp/nestjs-better-auth';

/**
 * Consumer Album Controller
 *
 * Public-facing endpoints for album browsing and discovery.
 * Routes are prefixed with /api/v1/albums
 * All endpoints are public (no authentication required).
 */
@Controller('api/v1/albums')
@Roles(['admin', 'user'])
export class ConsumerAlbumController {
  constructor(private readonly consumerAlbumService: ConsumerAlbumService) {}

  @Get(':id')
  async getAlbumById(@Param('id') albumId: string) {
    return this.consumerAlbumService.getAlbumById(albumId);
  }
}
