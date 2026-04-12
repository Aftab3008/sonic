import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { UploadService } from './upload.service';

@Controller('api/upload')
@Roles(['admin'])
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('presigned-url/image')
  async getPresignedImageUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
  ) {
    return this.uploadService.getPresignedImageUrl(filename, contentType);
  }

  @Get('presigned-url/recording-audio')
  async getPresignedRecordingAudioUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
    @Query('recordingId') recordingId: string,
  ) {
    return this.uploadService.getPresignedRecordingAudioUrl(
      filename,
      contentType,
      recordingId,
    );
  }
}
