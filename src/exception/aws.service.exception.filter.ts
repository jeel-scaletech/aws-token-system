import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ServiceException } from '@smithy/smithy-client';
import { Request, Response } from 'express';

@Catch(ServiceException)
export class AwsServiceExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.$response.statusCode ?? 403;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
    });
  }
}
