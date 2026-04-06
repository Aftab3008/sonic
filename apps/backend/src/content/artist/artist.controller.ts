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
import type { CreateArtistDto, UpdateArtistDto } from './artist.schemas';
import { CreateArtistSchema, UpdateArtistSchema } from './artist.schemas';
import { ArtistService } from './artist.service';

@Controller('api/artists')
@Roles(['admin'])
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.artistService.list(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateArtistSchema)) dto: CreateArtistDto,
  ) {
    return this.artistService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateArtistSchema)) dto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}
