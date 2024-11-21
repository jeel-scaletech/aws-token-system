import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './config.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ConfigService, AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
