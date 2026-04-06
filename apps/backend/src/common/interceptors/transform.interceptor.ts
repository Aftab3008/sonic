import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T> | any
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | any> {
    const path = context.switchToHttp().getRequest().url;
    if (path.startsWith('/api/auth')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Prevent double wrapping if PaginationInterceptor already manipulated it but didn't wrap
        // Actually, PaginationInterceptor just extracts the array.
        // We will wrap everything cleanly here.
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
