import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../common';
import type {
  CreateRecordingDto,
  UpdateRecordingDto,
} from './recording.schemas';
import {
  CreateRecordingSchema,
  UpdateRecordingSchema,
} from './recording.schemas';
import { RecordingService } from './recording.service';
import { Roles } from '@thallesp/nestjs-better-auth';

@Controller('api/recordings')
@Roles(['admin'])
export class RecordingController {
  constructor(private readonly recordingService: RecordingService) {}

  @Get()
  async findAll(@Query() query: Record<string, string>) {
    return await this.recordingService.list(query);
  }

  @Get('all')
  async getAllRecordings() {
    return await this.recordingService.getAllRecordings();
  }

  @Get('count/total')
  async getTotalCount() {
    const count = await this.recordingService.getTotalRecordingsCount();
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.recordingService.findOne(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateRecordingSchema))
    dto: CreateRecordingDto,
  ) {
    return await this.recordingService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRecordingSchema))
    dto: UpdateRecordingDto,
  ) {
    return await this.recordingService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.recordingService.remove(id);
  }
}
