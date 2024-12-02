import { Body, Controller, Get } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLogsReqDto } from './dto/logs.req.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getLogs(@Body() data: AuditLogsReqDto) {
    return await this.auditService.getLogs(data);
  }
}
