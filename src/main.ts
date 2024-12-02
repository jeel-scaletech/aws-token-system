import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseErrorInterceptor } from './exception/database.exception.filter';
import { ServiceErrorFilter } from './exception/service.exception.filter';
import { AwsServiceExceptionFilter } from './exception/aws.service.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // swagger
  const config = new DocumentBuilder()
    .setTitle('AWS Credential Helper')
    .setDescription(
      'API for easily generating and managing secret key securely',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}
bootstrap();
