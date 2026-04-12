import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsumerArtistService } from './consumer-artist.service';

/**
 * Consumer Artist Controller
 *
 * Public-facing endpoints for artist browsing and discovery.
 * Routes are prefixed with /api/v1/artists
 */
@Controller('api/v1/artists')
export class ConsumerArtistController {
  constructor(private readonly consumerArtistService: ConsumerArtistService) {}
}
