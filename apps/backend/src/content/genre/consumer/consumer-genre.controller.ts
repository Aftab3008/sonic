import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsumerGenreService } from './consumer-genre.service';

/**
 * Consumer Genre Controller
 *
 * Public-facing endpoints for genre browsing.
 * Routes are prefixed with /api/v1/genres
 */
@Controller('api/v1/genres')
export class ConsumerGenreController {
  constructor(private readonly consumerGenreService: ConsumerGenreService) {}
}
