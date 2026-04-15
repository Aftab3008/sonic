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
import { ZodValidationPipe } from '../../../common';
import type {
  ConfirmUploadDto,
  CreateRecordingDto,
  UpdateRecordingDto,
} from './dto/recording.schemas';
import {
  ConfirmUploadSchema,
  CreateRecordingSchema,
  UpdateRecordingSchema,
} from './dto/recording.schemas';
import { AdminRecordingService } from './admin-recording.service';
import { Roles } from '@thallesp/nestjs-better-auth';

/**
 * Admin Recording Controller
 *
 * Admin-only endpoints for recording management.
 * Routes: /api/admin/recordings
 */
@Controller('api/admin/recordings')
@Roles(['admin'])
export class AdminRecordingController {
  constructor(private readonly adminRecordingService: AdminRecordingService) {}

  @Get()
  async findAll(@Query() query: Record<string, string>) {
    return await this.adminRecordingService.list(query);
  }

  @Get('all')
  async getAllRecordings() {
    return await this.adminRecordingService.getAllRecordings();
  }

  @Get('count/total')
  async getTotalCount() {
    const count = await this.adminRecordingService.getTotalRecordingsCount();
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminRecordingService.findOne(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateRecordingSchema))
    dto: CreateRecordingDto,
  ) {
    return await this.adminRecordingService.create(dto);
  }

  /**
   * Confirm audio upload — sets sourceAudioUrl and transitions status to UPLOADED
   */
  @Post(':id/confirm-upload')
  @HttpCode(HttpStatus.OK)
  async confirmUpload(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ConfirmUploadSchema))
    dto: ConfirmUploadDto,
  ) {
    return await this.adminRecordingService.confirmUpload(id, dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRecordingSchema))
    dto: UpdateRecordingDto,
  ) {
    return await this.adminRecordingService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.adminRecordingService.remove(id);
  }
}
