import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['PRIMARY', 'FEATURED', 'PRODUCER']);

export const albumTypeEnum = pgEnum('album_type', [
  'ALBUM',
  'SINGLE',
  'EP',
  'COMPILATION',
]);

export const trackArtistRoleEnum = pgEnum('track_artist_role', [
  'PRIMARY',
  'FEATURED',
  'PRODUCER',
]);

export const releaseStatusEnum = pgEnum('release_status', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);

export const trackAudioStatusEnum = pgEnum('track_audio_status', [
  'PENDING_UPLOAD',
  'UPLOADED',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
]);
