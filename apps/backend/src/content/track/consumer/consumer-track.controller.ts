import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsumerTrackService } from './consumer-track.service';

/**
 * Consumer Track Controller
 *
 * Public-facing endpoints for track streaming and browsing.
 * Routes are prefixed with /api/v1/tracks
 */
@Controller('api/v1/tracks')
export class ConsumerTrackController {
  constructor(private readonly consumerTrackService: ConsumerTrackService) {}
}
