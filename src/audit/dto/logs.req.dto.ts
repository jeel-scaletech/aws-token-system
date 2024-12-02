import { IsNumber, IsOptional, IsString } from 'class-validator';

export type AuditLogsDetails = {
  limit: number;
  offset: number;
  user?: string;
};

export class AuditLogsReqDto {
  @IsNumber()
  @IsOptional()
  limit: number = 100;

  @IsNumber()
  @IsOptional()
  offset: number = 100;

  @IsString()
  @IsOptional()
  user?: string;
}
