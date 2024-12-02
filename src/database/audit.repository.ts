import { Inject, Injectable } from '@nestjs/common';
import { Database, DRIZZLE_DATABASE } from './database.module';
import { AuditLogsDetails } from 'src/audit/dto/logs.req.dto';

@Injectable()
export class AuditRepository {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly database: Database,
  ) {}

  async getAllLogs(details: AuditLogsDetails) {
    const { limit, offset, user } = details;

    return await this.database.query.auditLogs.findMany({
      where: (log, { eq }) => eq(log.user, user),
      limit,
      offset,
    });
  }
}
