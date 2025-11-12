import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetrySchema } from './telemetry.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Telemetry', schema: TelemetrySchema }])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
