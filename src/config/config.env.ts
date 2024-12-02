import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsPort, IsString, validateSync } from 'class-validator';

export class Env {
  @IsPort()
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DB_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_TOKEN_EXPIRY: string;

  @IsString()
  @IsNotEmpty()
  SALT: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_KEY: string;
}

export const validate = (env: Record<string, unknown>) => {
  const transformed = plainToInstance(Env, env, {
    exposeDefaultValues: true,
  });
  const errors = validateSync(transformed);
  if (errors.length > 0) throw new Error(errors.toString());

  return transformed;
};
