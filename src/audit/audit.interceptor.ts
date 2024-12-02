import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    // Gets the request log
    console.log(`req:`, {
      headers: request.headers,
      body: request.body,
      originalUrl: request.originalUrl,
    });

    const oldWrite = response.write;
    const oldEnd = response.end;
    const chunks = [];

    response.write = function (chunk: any) {
      chunks.push(chunk);
      // eslint-disable-next-line prefer-rest-params
      return oldWrite.apply(response, arguments);
    };

    response.end = function (chunk: any) {
      if (chunk) {
        chunks.push(chunk);
      }
      // eslint-disable-next-line prefer-rest-params
      return oldEnd.apply(response, arguments);
    };

    response.on('finish', () => {
      const { statusCode } = response;
      const responseBody = Buffer.concat(chunks).toString('utf8');
      this.logger.log(`[RESP] ${statusCode} ${responseBody}`);
    });
    next();
  }
}
