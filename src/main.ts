import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseErrorInterceptor } from './exception/database.exception.filter';
import { ServiceErrorFilter } from './exception/service.exception.filter';
import { AwsServiceExceptionFilter } from './exception/aws.service.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(AppConfigService);

  const port = configuration.get('PORT');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new DatabaseErrorInterceptor());
  app.useGlobalFilters(
    new ServiceErrorFilter(),
    new AwsServiceExceptionFilter(),
  );

  await app.listen(port);
}
bootstrap();
