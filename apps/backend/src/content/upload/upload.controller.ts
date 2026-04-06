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

  @Get('presigned-url/audio')
  async getPresignedAudioUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
    @Query('trackId') trackId: string,
    @Query('albumId') albumId: string,
  ) {
    return this.uploadService.getPresignedAudioUrl(
      filename,
      contentType,
      trackId,
      albumId,
    );
  }
}
