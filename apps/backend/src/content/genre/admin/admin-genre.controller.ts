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
import { AdminGenreService } from './admin-genre.service';
import { CreateGenreSchema, UpdateGenreSchema } from './dto/genre.schemas';
import type { CreateGenreDto, UpdateGenreDto } from './dto/genre.schemas';

/**
 * Admin Genre Controller
 *
 * Admin-only endpoints for genre management.
 * Routes are prefixed with /api/admin/genres
 */
@Controller('api/admin/genres')
@Roles(['admin'])
export class AdminGenreController {
  constructor(private readonly adminGenreService: AdminGenreService) {}

  /**
   * List all genres (admin view)
   */
  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.adminGenreService.list(query);
  }

  /**
   * Get total genres count
   */
  @Get('count/total')
  async getTotalGenresCount() {
    return this.adminGenreService.getTotalGenresCount();
  }

  /**
   * Get all genres (simplified list)
   */
  @Get('all')
  async getAllGenres() {
    return this.adminGenreService.getAllGenres();
  }

  /**
   * Get single genre by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminGenreService.findOne(id);
  }

  /**
   * Create new genre
   */
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateGenreSchema)) dto: CreateGenreDto,
  ) {
    return this.adminGenreService.create(dto);
  }

  /**
   * Update existing genre
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateGenreSchema)) dto: UpdateGenreDto,
  ) {
    return this.adminGenreService.update(id, dto);
  }

  /**
   * Delete genre
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminGenreService.remove(id);
  }
}
