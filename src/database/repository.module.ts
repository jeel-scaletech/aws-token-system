import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserRepository } from './user.repository';
import { IamUserRepository } from './iam-user.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, IamUserRepository],
  exports: [UserRepository, IamUserRepository],
})
export class RepositoryModule {}
