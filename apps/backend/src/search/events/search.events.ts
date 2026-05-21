/**
 * Domain Events for Search Indexing
 *
 * Admin services emit these events. SearchIndexListener subscribes to them.
 * This completely decouples search indexing from domain logic.
 */

export class TrackCreatedEvent {
  constructor(public readonly trackId: string) {}
}

export class TrackUpdatedEvent {
  constructor(public readonly trackId: string) {}
}

export class TrackDeletedEvent {
  constructor(public readonly trackId: string) {}
}

export class AlbumCreatedEvent {
  constructor(
    public readonly albumId: string,
    public readonly releaseStatus: string,
  ) {}
}

export class AlbumUpdatedEvent {
  constructor(
    public readonly albumId: string,
    public readonly releaseStatus: string,
  ) {}
}

export class AlbumDeletedEvent {
  constructor(public readonly albumId: string) {}
}

/**
 * Emitted when an album transitions from any status → PUBLISHED.
 * Listener should index the album AND all its tracks.
 */
export class AlbumPublishedEvent {
  constructor(public readonly albumId: string) {}
}

/**
 * Emitted when an album transitions from PUBLISHED → DRAFT / ARCHIVED.
 * Listener should remove the album AND all its tracks from index.
 */
export class AlbumUnpublishedEvent {
  constructor(public readonly albumId: string) {}
}

export class ArtistCreatedEvent {
  constructor(public readonly artistId: string) {}
}

export class ArtistUpdatedEvent {
  constructor(public readonly artistId: string) {}
}

export class ArtistDeletedEvent {
  constructor(public readonly artistId: string) {}
}
