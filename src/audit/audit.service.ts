import { Injectable } from '@nestjs/common';
import { AuditRepository } from 'src/database/audit.repository';
import { AuditLogsDetails } from './dto/logs.req.dto';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepo: AuditRepository) {}

  async getLogs(details: AuditLogsDetails) {
    return await this.auditRepo.getAllLogs(details);
  }
}
