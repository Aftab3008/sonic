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
import type { CreateArtistDto, UpdateArtistDto } from './dto/artist.schemas';
import { CreateArtistSchema, UpdateArtistSchema } from './dto/artist.schemas';
import { AdminArtistService } from './admin-artist.service';

/**
 * Admin Artist Controller
 *
 * Admin-only endpoints for artist management.
 * Routes are prefixed with /api/admin/artists
 * Requires admin role authentication.
 */
@Controller('api/admin/artists')
@Roles(['admin'])
export class AdminArtistController {
  constructor(private readonly adminArtistService: AdminArtistService) {}

  /**
   * List all artists (admin view)
   */
  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.adminArtistService.list(query);
  }

  /**
   * Get total artists count
   */
  @Get('count/total')
  async getTotalArtistsCount() {
    return this.adminArtistService.getTotalArtistsCount();
  }

  /**
   * Get all artists (simplified list)
   */
  @Get('all')
  async getAllArtists() {
    return this.adminArtistService.getAllArtists();
  }

  /**
   * Get single artist by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminArtistService.findOne(id);
  }

  /**
   * Create new artist
   */
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateArtistSchema)) dto: CreateArtistDto,
  ) {
    return this.adminArtistService.create(dto);
  }

  /**
   * Update existing artist
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateArtistSchema)) dto: UpdateArtistDto,
  ) {
    return this.adminArtistService.update(id, dto);
  }

  /**
   * Delete artist
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminArtistService.remove(id);
  }
}
