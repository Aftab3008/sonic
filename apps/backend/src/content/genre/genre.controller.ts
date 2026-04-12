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
import { ZodValidationPipe, PaginationHeaderInterceptor } from '../../common';
import { GenreService } from './genre.service';
import { CreateGenreSchema, UpdateGenreSchema } from './genre.schemas';
import type { CreateGenreDto, UpdateGenreDto } from './genre.schemas';

@Controller('api/genres')
@Roles(['admin'])
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.genreService.list(query);
  }

  @Get('count/total')
  async getTotalGenresCount() {
    return this.genreService.getTotalGenresCount();
  }

  @Get('all')
  async getAllGenres() {
    return this.genreService.getAllGenres();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateGenreSchema)) dto: CreateGenreDto,
  ) {
    return this.genreService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateGenreSchema)) dto: UpdateGenreDto,
  ) {
    return this.genreService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.genreService.remove(id);
  }
}
