import { Inject, Injectable } from '@nestjs/common';
import { Database, DRIZZLE_DATABASE } from './database.module';
import { and, eq, sql } from 'drizzle-orm';
import { usersTable } from './schema';
import { AppConfigService } from 'src/config/config.service';
import { ServiceError } from 'src/utils/core.exception';

@Injectable()
export class UserRepository {
  private readonly salt: string;

  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: Database,

    private readonly config: AppConfigService,
  ) {
    this.salt = this.config.get('SALT');
  }

  async findUserWithPassword(email: string, password: string) {
    return await this.db.query.usersTable.findFirst({
      where: and(
        eq(usersTable.email, email),
        sql`${usersTable.password} = crypt(${password}, ${this.salt})`,
      ),
      columns: {
        email: true,
        userArn: true,
      },
    });
  }

  async getUser(email: string) {
    return await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  }

  async getUserOrFail(email: string) {
    const user = await this.getUser(email);
    if (user == null) throw new ServiceError(404, 'User Not Found!');
    return user;
  }
}
