import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
import type { CreateAlbumDto, UpdateAlbumDto } from './dto/album.schemas';
import { AdminAlbumService } from './admin-album.service';
import { CreateAlbumSchema, UpdateAlbumSchema } from './dto//album.schemas';

/**
 * Admin Album Controller
 *
 * Admin-only endpoints for album management.
 * Routes are prefixed with /api/admin/albums
 * Requires admin role authentication.
 */
@Controller('api/admin/albums')
@Roles(['admin'])
export class AdminAlbumController {
  constructor(private readonly adminAlbumService: AdminAlbumService) {}

  /**
   * List all albums (admin view)
   * Supports filtering, sorting, and cursor pagination
   */
  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.adminAlbumService.list(query);
  }

  /**
   * Get total albums count for admin dashboard
   */
  @Get('count/total')
  async getTotalAlbumsCount(@Headers() headers: Record<string, string>) {
    return this.adminAlbumService.getTotalAlbumsCount();
  }

  /**
   * Get single album by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminAlbumService.findOne(id);
  }

  /**
   * Create new album
   */
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateAlbumSchema)) dto: CreateAlbumDto,
  ) {
    return this.adminAlbumService.create(dto);
  }

  /**
   * Update existing album
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAlbumSchema)) dto: UpdateAlbumDto,
  ) {
    return this.adminAlbumService.update(id, dto);
  }

  /**
   * Delete album
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminAlbumService.remove(id);
  }
}
