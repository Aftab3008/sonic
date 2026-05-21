import { Controller, Get, Inject, Post } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { SEARCH_ENGINE } from '../search/interfaces/search-engine.interface';
import type { SearchEngine } from '../search/interfaces/search-engine.interface';
import { SearchReindexService } from '../search/reindex/search-reindex.service';

/**
 * Admin Search Controller
 *
 * POST /api/admin/search/reindex  — trigger full reindex (admin only)
 * GET  /api/admin/search/stats    — Meilisearch index stats
 */
@Controller('api/admin/search')
@Roles(['admin'])
export class AdminSearchController {
  constructor(
    @Inject(SEARCH_ENGINE) private readonly engine: SearchEngine,
    private readonly reindexService: SearchReindexService,
  ) {}

  @Post('reindex')
  async reindex() {
    const result = await this.reindexService.reindexAll();
    return {
      message: 'Reindex complete',
      indexed: result,
    };
  }

  @Get('stats')
  async stats() {
    return this.engine.getStats();
  }
}
