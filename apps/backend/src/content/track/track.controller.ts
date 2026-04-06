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
import { TrackService } from './track.service';
import { CreateTrackSchema, UpdateTrackSchema } from './track.schemas';
import type { CreateTrackDto, UpdateTrackDto } from './track.schemas';

@Controller('api/tracks')
@Roles(['admin'])
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @UseInterceptors(PaginationHeaderInterceptor)
  async list(@Query() query: Record<string, string>) {
    return this.trackService.list(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.trackService.findOne(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateTrackSchema)) dto: CreateTrackDto,
  ) {
    return this.trackService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTrackSchema)) dto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.trackService.remove(id);
  }

  @Post(':id/upload-url')
  async getUploadUrl(
    @Param('id') id: string,
    @Body() body: { filename: string; contentType: string },
  ) {
    return this.trackService.generateUploadUrl(
      id,
      body.filename,
      body.contentType,
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status:
        | 'PENDING_UPLOAD'
        | 'UPLOADED'
        | 'PROCESSING'
        | 'SUCCEEDED'
        | 'FAILED';
    },
  ) {
    return this.trackService.updateAudioStatus(id, body.status);
  }
}
