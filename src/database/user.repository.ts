import { Inject, Injectable } from '@nestjs/common';
import { Database, DRIZZLE_DATABASE } from './database.module';
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
      where: (users, { eq, and, sql }) =>
        and(
          eq(users.email, email),
          sql`${users.password} = crypt(${password}, ${this.salt})`,
        ),
      columns: {
        email: true,
        userArn: true,
      },
    });
  }

  async getUser(email: string) {
    return await this.db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async getUserOrFail(email: string) {
    const user = await this.getUser(email);
    if (user == null) throw new ServiceError(404, 'User Not Found!');
    return user;
  }
}
