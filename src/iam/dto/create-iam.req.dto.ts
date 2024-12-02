import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { IAMPolicyDocument } from './policy.types';
import { Type } from 'class-transformer';

export class CreateIamUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @Type(() => IAMPolicyDocument)
  @ValidateNested()
  policyDocument: IAMPolicyDocument;
}
