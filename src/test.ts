import { AppConfigService } from './config/config.service';
import {
  GetUserCommand,
  IAMClient,
  SimulatePrincipalPolicyCommand,
} from '@aws-sdk/client-iam';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config.env';
import { AppConfigModule } from './config/config.module';
import { IAMPolicyDocument } from './iam/dto/policy.types';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const inlinePolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: 's3:GetObject',
      Resource: '*',
    },
    {
      Effect: 'Deny',
      Action: 's3:DeleteObject',
      Resource: '*',
    },
  ],
};

const transformed = plainToInstance(IAMPolicyDocument, inlinePolicy);
const validated = validateSync(inlinePolicy);

console.log(transformed, validated);

const a = {
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
};

const toArrayIfSingle = <T>(obj_or_arr: T | T[]) =>
  Array.isArray(obj_or_arr) ? obj_or_arr : [obj_or_arr];

async function bootstrap() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ validate }), AppConfigModule],
    providers: [a],
  }).compile();

  const iam = module.get(IAMClient);

  const user = await iam
    .send(
      new GetUserCommand({
        UserName: 'iam-controller-api',
      }),
    )
    .then((x) => x.User.Arn);

  const sentRequests = inlinePolicy.Statement.map(
    (x) =>
      new SimulatePrincipalPolicyCommand({
        ActionNames: toArrayIfSingle(x.Action),
        PolicySourceArn: user,
        ResourceArns: toArrayIfSingle(x.Resource),
      }),
  ).map((x) => iam.send(x));

  const validated = (await Promise.all(sentRequests))
    .flatMap((x) => x.EvaluationResults)
    .filter((x) => x.EvalDecision != 'allowed');

  console.log(validated);
}

bootstrap();
