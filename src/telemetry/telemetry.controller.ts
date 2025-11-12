import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('api/v1')
export class TelemetryController {
  constructor(private readonly service: TelemetryService) {}

  @Post('telemetry')
  async create(@Body() body) {
    return this.service.ingest(body);
  }

  @Get('devices/:deviceId/latest')
  async getLatest(@Param('deviceId') deviceId: string) {
    return this.service.getLatest(deviceId);
  }

  @Get('sites/:siteId/summary')
  async getSummary(
    @Param('siteId') siteId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.service.getSummary(siteId, from, to);
  }
}
