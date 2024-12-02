import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { validate } from './config/config.env';
import { RepositoryModule } from './database/repository.module';
import { AuthModule } from './auth/auth.module';
import { IamModule } from './iam/iam.module';
import { TokenModule } from './token/token.module';
import { IamClientModule } from './globals/iam-client.module';

@Module({
  imports: [
    // custom configuration modules
    ConfigModule.forRoot({ validate }),
    AppConfigModule,
    // database and repository modules
    DatabaseModule,
    RepositoryModule,
    // Global singletons
    IamClientModule,
    // API Modules
    AuthModule,
    IamModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
