import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsumerGenreService } from './consumer-genre.service';
import { Roles } from '@thallesp/nestjs-better-auth';

/**
 * Consumer Genre Controller
 *
 * Public-facing endpoints for genre browsing.
 * Routes are prefixed with /api/v1/genres
 */
@Controller('api/v1/genres')
@Roles(['admin', 'user'])
export class ConsumerGenreController {
  constructor(private readonly consumerGenreService: ConsumerGenreService) {}

  @Get()
  async getGenres() {
    return await this.consumerGenreService.getGenres();
  }
}
