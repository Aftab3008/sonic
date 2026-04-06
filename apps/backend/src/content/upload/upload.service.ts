import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import * as path from 'path';

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const AUDIO_MIMES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/flac',
  'audio/aac',
  'audio/ogg',
  'audio/x-m4a',
  'audio/mp4',
];

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3: S3Client;
  private readonly imageBucket: string;
  private readonly audioBucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.imageBucket =
      this.configService.getOrThrow<string>('AWS_IMAGE_BUCKET');
    this.audioBucket =
      this.configService.getOrThrow<string>('AWS_AUDIO_BUCKET');

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async getPresignedImageUrl(filename: string, contentType: string) {
    if (!filename || !contentType) {
      throw new BadRequestException('filename and contentType are required');
    }

    if (!IMAGE_MIMES.includes(contentType)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const ext = path.extname(filename) || '.jpg';
    const key = `images/${randomUUID()}${ext}`;
    const uploadUrl = await this.getPresignedUrl(
      this.imageBucket,
      key,
      contentType,
    );

    return { uploadUrl, key };
  }

  async getPresignedAudioUrl(
    filename: string,
    contentType: string,
    trackId: string,
    albumId: string,
  ) {
    if (!filename || !contentType || !trackId || !albumId) {
      throw new BadRequestException(
        'filename, contentType, trackId, and albumId are required',
      );
    }

    if (!AUDIO_MIMES.includes(contentType)) {
      throw new BadRequestException('Only audio files are allowed');
    }

    const ext = path.extname(filename) || '.mp3';
    const key = `upload-track/${albumId}/${trackId}${ext}`;
    const uploadUrl = await this.getPresignedUrl(
      this.audioBucket,
      key,
      contentType,
    );

    return { uploadUrl, key };
  }

  private async getPresignedUrl(
    bucket: string,
    key: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}
