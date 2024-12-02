import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserRepository } from './user.repository';
import { IamUserRepository } from './iam-user.repository';
import { AuditRepository } from './audit.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, IamUserRepository, AuditRepository],
  exports: [UserRepository, IamUserRepository, AuditRepository],
})
export class RepositoryModule {}
