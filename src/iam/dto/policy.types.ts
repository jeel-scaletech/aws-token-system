import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
  IsObject,
  IsNotEmpty,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Define an enum for Effect, as it can only be "Allow" or "Deny"
export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

const toArrayIfSingle = <T>(obj_or_arr: T | T[]) =>
  Array.isArray(obj_or_arr) ? obj_or_arr : [obj_or_arr];

const toArrayIfSingleNullable = <T>(obj_or_arr: T | T[] | null | undefined) =>
  obj_or_arr == null ? null : toArrayIfSingle(obj_or_arr);

export class IAMPolicyStatement {
  @IsEnum(Effect)
  @IsNotEmpty()
  Effect: Effect;

  @Transform(({ value }) => toArrayIfSingleNullable(value))
  @IsArray()
  @IsNotEmpty()
  Action: string[];

  @Transform(({ value }) => toArrayIfSingleNullable(value))
  @IsOptional()
  @IsArray()
  NotAction?: string[];

  @Transform(({ value }) => toArrayIfSingleNullable(value))
  @IsArray()
  @IsNotEmpty()
  Resource: string[];

  @Transform(({ value }) => toArrayIfSingleNullable(value))
  @IsOptional()
  @IsArray()
  NotResource?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  Condition?: Record<string, Record<string, string | string[]>>;

  @IsOptional()
  @IsString()
  Sid?: string;
}

export class IAMPolicyDocument {
  @IsString()
  @IsNotEmpty()
  Version: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IAMPolicyStatement)
  @ArrayNotEmpty()
  Statement: IAMPolicyStatement[];
}
