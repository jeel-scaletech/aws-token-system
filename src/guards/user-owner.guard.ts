import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IamUserRepository } from 'src/database/iam-user.repository';

@Injectable()
export class UsernameOwnerGuard implements CanActivate {
  constructor(private readonly userRepo: IamUserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const iamUser = await this.userRepo.getUserOrFail(request.params.username);
    return iamUser.owner == request.user.email;
  }
}
