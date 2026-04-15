import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AwsWebhookGuard implements CanActivate {
  private readonly logger = new Logger(AwsWebhookGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('AWS Webhook Guard');
    const request = context.switchToHttp().getRequest();
    const signature =
      request.headers['X-Sonic-Signature'] ||
      request.headers['x-sonic-signature'];
    const secret = this.configService.get<string>('WEBHOOK_SECRET');

    if (!signature) {
      this.logger.warn('Missing webhook signature');
      throw new UnauthorizedException('Missing signature');
    }

    if (!secret) {
      this.logger.error('WEBHOOK_SECRET is not configured');
      throw new UnauthorizedException('Security configuration error');
    }

    // Use rawBody for HMAC — preserves exact bytes lambda sent.
    // JSON.stringify(parsed_body) can reorder keys and break signature.
    const body = request.rawBody
      ? request.rawBody.toString('utf-8')
      : JSON.stringify(request.body);

    const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');

    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(hash),
      );

      if (!isValid) {
        this.logger.warn('Invalid webhook signature');
        throw new UnauthorizedException('Invalid signature');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.warn('Signature comparison failed', errorMessage);
      throw new UnauthorizedException('Invalid signature format');
    }

    const timestamp = request.body.timestamp;

    if (!timestamp) {
      this.logger.warn('Missing timestamp in webhook body');
      throw new UnauthorizedException('Missing timestamp');
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    if (timestamp < fiveMinutesAgo) {
      this.logger.warn('Webhook timestamp expired');
      throw new UnauthorizedException('Request expired');
    }

    return true;
  }
}
