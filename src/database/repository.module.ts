import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserRepository } from './user.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
