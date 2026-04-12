import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import {
  ZodValidationPipe,
  PaginationHeaderInterceptor,
} from '../../../common';
import { AdminTrackService } from './admin-track.service';
import { CreateTrackSchema, UpdateTrackSchema } from './dto/track.schemas';
import type { CreateTrackDto, UpdateTrackDto } from './dto/track.schemas';

/**
 * Admin Track Controller
 *
 * Admin-only endpoints for track management.
 * Routes: /api/admin/tracks
 */
@Controller('api/admin/tracks')
@Roles(['admin'])
export class AdminTrackController {
  constructor(private readonly adminTrackService: AdminTrackService) {}

  /**
   * List all tracks
   */
  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.adminTrackService.list(query);
  }

  /**
   * Get total tracks count
   */
  @Get('count/total')
  async getTotalTracksCount() {
    return this.adminTrackService.getTotalTracksCount();
  }

  /**
   * Get single track by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminTrackService.findOne(id);
  }

  /**
   * Get tracks by album
   */
  @Get('by-album/:albumId')
  async findByAlbum(@Param('albumId') albumId: string) {
    return this.adminTrackService.findByAlbum(albumId);
  }

  /**
   * Create new track
   */
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateTrackSchema)) dto: CreateTrackDto,
  ) {
    return this.adminTrackService.create(dto);
  }

  /**
   * Update existing track
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTrackSchema)) dto: UpdateTrackDto,
  ) {
    return this.adminTrackService.update(id, dto);
  }

  /**
   * Delete track
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminTrackService.remove(id);
  }
}
