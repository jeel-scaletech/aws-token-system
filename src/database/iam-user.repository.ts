import { Inject, Injectable } from '@nestjs/common';
import { Database, DRIZZLE_DATABASE } from './database.module';
import { eq } from 'drizzle-orm';
import { iamUsersTable } from './schema';
import { ServiceError } from 'src/utils/core.exception';

@Injectable()
export class IamUserRepository {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: Database,
  ) {}

  async getUser(username: string) {
    return await this.db.query.iamUsersTable.findFirst({
      where: eq(iamUsersTable.username, username),
    });
  }

  async getUserOrFail(username: string) {
    const user = await this.getUser(username);
    if (user == null) {
      throw new ServiceError(404, 'User not found!');
    }
    return user;
  }
}
