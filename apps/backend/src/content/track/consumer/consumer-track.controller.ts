import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsumerTrackService } from './consumer-track.service';
import { Roles } from '@thallesp/nestjs-better-auth';

/**
 * Consumer Track Controller
 *
 * Public-facing endpoints for track streaming and browsing.
 * Routes are prefixed with /api/v1/tracks
 */
@Controller('api/v1/tracks')
@Roles(['admin', 'user'])
export class ConsumerTrackController {
  constructor(private readonly consumerTrackService: ConsumerTrackService) {}

  @Get()
  async getTracks(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ) {
    return this.consumerTrackService.getTracks(limit);
  }
}
