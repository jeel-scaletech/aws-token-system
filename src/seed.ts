import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './config/config.service';
import {
  Database,
  DatabaseModule,
  DRIZZLE_DATABASE,
} from './database/database.module';
import { usersTable } from './database/schema';
import { sql } from 'drizzle-orm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.env';
import { AppConfigModule } from './config/config.module';
import { RepositoryModule } from './database/repository.module';

@Module({
  imports: [
    // custom configuration modules
    ConfigModule.forRoot({ validate }),
    AppConfigModule,
    // database and repository modules
    DatabaseModule,
    RepositoryModule,
  ],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const config = app.get(AppConfigService);
  const db: Database = app.get(DRIZZLE_DATABASE);
  const salt = config.get('SALT');

  await db.insert(usersTable).values([
    {
      email: 'jeelpatel231@gmail.com',
      password: sql`crypt('password', ${salt})`,
      userArn: 'arn:aws:iam::585293969917:user/iam-controller-api',
    },
    {
      email: 'jeelpatel231@gmail2.com',
      password: sql`crypt('password', ${salt})`,
      userArn: 'arn:aws:iam::585293969917:user/iam-controller-api2',
    },
  ]);
}
bootstrap();
