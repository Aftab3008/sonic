import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
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
  private readonly cloudfrontImageDomain: string | undefined;
  private readonly cloudfrontAudioDomain: string | undefined;
  private readonly useCloudfront: boolean;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.imageBucket =
      this.configService.getOrThrow<string>('AWS_IMAGE_BUCKET');
    this.audioBucket =
      this.configService.getOrThrow<string>('AWS_AUDIO_BUCKET');

    this.cloudfrontImageDomain =
      this.configService.get<string>('AWS_CLOUDFRONT_IMAGE_DOMAIN');
    this.cloudfrontAudioDomain =
      this.configService.get<string>('AWS_CLOUDFRONT_AUDIO_DOMAIN');
    this.useCloudfront =
      this.configService.get<string>('USE_CLOUDFRONT') === 'true';

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      // Disable automatic checksum calculation to prevent signature mismatch with presigned URLs in ap-south-2
      // requestChecksumCalculation: 'WHEN_REQUIRED',
      // responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  private buildFileUrl(
    bucket: string,
    key: string,
    type: 'image' | 'audio',
  ): string {
    if (this.useCloudfront) {
      if (type === 'image' && this.cloudfrontImageDomain) {
        return `https://${this.cloudfrontImageDomain}/${key}`;
      }
      if (type === 'audio' && this.cloudfrontAudioDomain) {
        return `https://${this.cloudfrontAudioDomain}/${key}`;
      }
    }
    // Fallback to path-style S3 URL (avoids SSL issues with dots in bucket names)
    return `https://s3.${this.region}.amazonaws.com/${bucket}/${key}`;
  }

  async getPresignedImageUrl(filename: string, contentType: string) {
    if (!filename || !contentType) {
      throw new BadRequestException('filename and contentType are required');
    }

    if (!IMAGE_MIMES.includes(contentType)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const ext = path.extname(filename) || '.jpg';
    const key = `images/${nanoid()}${ext}`;
    const uploadUrl = await this.getPresignedUrl(
      this.imageBucket,
      key,
      contentType,
    );
    const fileUrl = this.buildFileUrl(this.imageBucket, key, 'image');

    return { uploadUrl, key, fileUrl };
  }

  async getPresignedRecordingAudioUrl(
    filename: string,
    contentType: string,
    recordingId: string,
  ) {
    if (!filename || !contentType || !recordingId) {
      throw new BadRequestException(
        'filename, contentType, and recordingId are required',
      );
    }

    if (!AUDIO_MIMES.includes(contentType)) {
      throw new BadRequestException('Only audio files are allowed');
    }

    const ext = path.extname(filename) || '.mp3';
    const key = `recordings/${recordingId}${ext}`;
    const uploadUrl = await this.getPresignedUrl(
      this.audioBucket,
      key,
      contentType,
    );
    const fileUrl = this.buildFileUrl(this.audioBucket, key, 'audio');

    return { uploadUrl, key, fileUrl };
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
