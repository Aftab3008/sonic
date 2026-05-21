import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { SEARCH_ENGINE } from './interfaces/search-engine.interface';
import { MeilisearchAdapter } from './adapters/meilisearch.adapter';
import { SongIndexer } from './indexers/song.indexer';
import { AlbumIndexer } from './indexers/album.indexer';
import { ArtistIndexer } from './indexers/artist.indexer';
import { SearchIndexListener } from './listeners/search-index.listener';
import { SearchReindexService } from './reindex/search-reindex.service';
import { SearchController } from './search.controller';

/**
 * SearchModule
 *
 * Registers the abstract SearchEngine (currently Meilisearch).
 * To swap engines: change `useClass: MeilisearchAdapter` to your new adapter.
 *
 * Exports SEARCH_ENGINE so the admin reindex controller can inject it.
 */
@Module({
  imports: [DbModule],
  controllers: [SearchController],
  providers: [
    {
      provide: SEARCH_ENGINE,
      useClass: MeilisearchAdapter,
    },
    SongIndexer,
    AlbumIndexer,
    ArtistIndexer,
    SearchIndexListener,
    SearchReindexService,
  ],
  exports: [SEARCH_ENGINE, SearchReindexService],
})
export class SearchModule {}
