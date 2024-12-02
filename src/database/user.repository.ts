import { Inject, Injectable } from '@nestjs/common';
import { Database, DRIZZLE_DATABASE } from './database.module';
import { and, eq, sql } from 'drizzle-orm';
import { usersTable } from './schema';
import { AppConfigService } from 'src/config/config.service';

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

  async findUserWithPassword(
    email: string,
    password: string,
  ): Promise<{ email: string } | undefined> {
    const [user] = await this.db
      .select({
        email: usersTable.email,
        userArn: usersTable.userArn,
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          sql`${usersTable.password} = crypt(${password}, ${this.salt})`,
        ),
      )
      .limit(1);

    return user;
  }
}
