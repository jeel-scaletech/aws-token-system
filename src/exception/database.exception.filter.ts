import { DatabaseError } from 'pg';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

// https://www.postgresql.org/docs/current/errcodes-appendix.html
function databaseExceptionMapper(err: DatabaseError): never {
  switch (err.code) {
    case '23000': // Integrity constraint violation
    case '23502': // Not Null violation
    case '23503': // Foreign key violation
    case '23505': // Unique key violation
      throw new BadRequestException(err.detail);

    default:
      throw new InternalServerErrorException(
        `Unhandled Database Exception occurred with code ${err.code}`,
      );
  }
}

@Injectable()
export class DatabaseErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof DatabaseError) {
          // if its a database error, map it to an http exception.
          databaseExceptionMapper(error);
        }
        throw error;
      }),
    );
  }
}
