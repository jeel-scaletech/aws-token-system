import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(AppConfigService);

  const port = configuration.get('PORT');

  await app.listen(port);
}
bootstrap();
