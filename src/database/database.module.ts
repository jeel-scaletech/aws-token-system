import { Module } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DRIZZLE_DATABASE = Symbol('drizzle-conn');

export type Database = NodePgDatabase<typeof schema>;

@Module({
  providers: [
    {
      provide: DRIZZLE_DATABASE,
      useFactory: (config: AppConfigService) =>
        drizzle(config.get('DB_URL'), { schema }),
      inject: [AppConfigService],
    },
  ],
  exports: [DRIZZLE_DATABASE],
})
export class DatabaseModule {}
