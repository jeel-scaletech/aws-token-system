import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { IAMClient } from '@aws-sdk/client-iam';
import { AppConfigService } from 'src/config/config.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IAMClient,
      useFactory: (config: AppConfigService) =>
        new IAMClient({
          region: config.get('AWS_REGION'),
          credentials: {
            accessKeyId: config.get('AWS_ACCESS_KEY'),
            secretAccessKey: config.get('AWS_SECRET_KEY'),
          },
        }),
      inject: [AppConfigService],
    },
    IamService,
  ],
  controllers: [IamController],
})
export class IamModule {}
