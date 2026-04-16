import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Selective body parsing — skip /api/auth (Better Auth handles its own body)
  // For webhook routes, capture rawBody for HMAC signature verification
  const jsonParserWithRawBody = json({
    limit: '50mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  });
  const jsonParser = json({ limit: '50mb' });

  const urlencodedParser = urlencoded({ extended: true, limit: '50mb' });

  app.use((req: any, _res: any, next: any) => {
    if (req.originalUrl?.startsWith('/api/auth')) {
      return next();
    }
    const parser = req.originalUrl?.startsWith('/api/webhooks')
      ? jsonParserWithRawBody
      : jsonParser;
    parser(req, _res, (err: any) => {
      if (err) return next(err);
      urlencodedParser(req, _res, next);
    });
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://172.16.112.55',
      'exp://172.16.112.55',
      'sonic://api',
    ],
    credentials: true,
    exposedHeaders: ['x-total-count', 'x-next-cursor', 'x-prev-cursor'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
