import { ValidUser } from './valid-user.type';

export type JwtPayload = ValidUser & {
  iat: number;
  exp: number;
};
