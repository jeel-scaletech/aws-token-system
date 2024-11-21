import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './config.env';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<Env>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.getOrThrow(key, { infer: true });
  }
}
