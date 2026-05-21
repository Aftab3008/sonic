import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { ZodValidationPipe } from '../common';
import { SEARCH_ENGINE } from './interfaces/search-engine.interface';
import type { SearchEngine } from './interfaces/search-engine.interface';
import { SearchQuerySchema } from './dto/search-query.dto';
import type { SearchQueryDto } from './dto/search-query.dto';

/**
 * Search Controller
 *
 * GET /api/v1/search?q=<query>&type=all|songs|albums|artists&limit=20&offset=0
 *
 * Returns results grouped by type, all wrapped by TransformInterceptor:
 * { success, data: { songs, albums, artists, query, processingTimeMs }, timestamp }
 */
@Controller('api/v1/search')
@Roles(['admin', 'user'])
export class SearchController {
  constructor(
    @Inject(SEARCH_ENGINE) private readonly searchEngine: SearchEngine,
  ) {}

  @Get()
  async search(
    @Query(new ZodValidationPipe(SearchQuerySchema)) query: SearchQueryDto,
  ) {
    return this.searchEngine.search(query.q, {
      type: query.type,
      limit: query.limit,
      offset: query.offset,
    });
  }
}
