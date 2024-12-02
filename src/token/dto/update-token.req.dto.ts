import { IsEnum } from 'class-validator';

export enum TokenState {
  Active = 'Active',
  Inactive = 'Inactive',
}

export type UpdateTokenDetails = {
  tokenState: TokenState;
};

export class UpdateTokenReqDto implements UpdateTokenDetails {
  @IsEnum(TokenState)
  tokenState: TokenState;
}
