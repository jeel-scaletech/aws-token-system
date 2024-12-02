import { IAMClient } from '@aws-sdk/client-iam';
import { Global, Module } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';

@Global()
@Module({
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
  ],
  exports: [IAMClient],
})
export class IamClientModule {}
