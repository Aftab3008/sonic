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
import { ZodValidationPipe, PaginationHeaderInterceptor } from '../../common';
import type { CreateAlbumDto, UpdateAlbumDto } from './album.schemas';
import { CreateAlbumSchema, UpdateAlbumSchema } from './album.schemas';
import { AlbumService } from './album.service';

@Controller('api/albums')
@Roles(['admin'])
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.albumService.list(query);
  }

  @Get('count/total')
  async getTotalAlbumsCount(@Headers() headers: Record<string, string>) {
    return this.albumService.getTotalAlbumsCount();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateAlbumSchema)) dto: CreateAlbumDto,
  ) {
    return this.albumService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAlbumSchema)) dto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }
}
