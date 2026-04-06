import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response } from 'express';

/**
 * Intercepts `CursorPage<T>` responses from list endpoints.
 *
 * - Sets `x-total-count`, `x-next-cursor`, `x-prev-cursor` headers for
 *   backward compatibility with simple-rest clients.
 * - Passes through the full `CursorPage<T>` object in the body so that the
 *   `TransformInterceptor` wraps it as `{ success, data: CursorPage<T> }`.
 *
 * The frontend should read pagination metadata from the body (canonical)
 * rather than headers.
 */
@Injectable()
export class PaginationHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        if (
          result &&
          typeof result === 'object' &&
          'data' in result &&
          'pagination' in result
        ) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse<Response>();
          const { pagination } = result;

          // Set headers for backward compatibility
          response.header('x-total-count', pagination.total.toString());

          const exposeList = ['x-total-count'];

          if (pagination.nextCursor) {
            response.header('x-next-cursor', pagination.nextCursor);
            exposeList.push('x-next-cursor');
          }
          if (pagination.prevCursor) {
            response.header('x-prev-cursor', pagination.prevCursor);
            exposeList.push('x-prev-cursor');
          }

          response.header(
            'access-control-expose-headers',
            exposeList.join(', '),
          );

          // Pass through the full CursorPage<T> — TransformInterceptor will wrap it
          return result;
        }
        return result;
      }),
    );
  }
}
