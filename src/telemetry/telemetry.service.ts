import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Redis from 'ioredis';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelemetryService {
  private redis: Redis;

  constructor(
    @InjectModel('Telemetry') private telemetryModel: Model<any>,
    private configService: ConfigService, // inject config
  ) {
   this.redis = new Redis(this.configService.get<string>('REDIS_URL')!);
  }

  async ingest(data: any) {
    if (Array.isArray(data)) {
      for (const item of data) await this.handleTelemetry(item);
    } else {
      await this.handleTelemetry(data);
    }
  }

  async handleTelemetry(payload: any) {
    const doc = await this.telemetryModel.create(payload);
    await this.redis.set(`latest:${payload.deviceId}`, JSON.stringify(doc));

    // Alert conditions
    const { temperature, humidity } = payload.metrics;
    if (temperature > 50 || humidity > 90) {
      const reason = temperature > 50 ? 'HIGH_TEMPERATURE' : 'HIGH_HUMIDITY';
      const webhookUrl = this.configService.get<string>('ALERT_WEBHOOK_URL');
      if (webhookUrl) {
        await axios.post(webhookUrl, {
          deviceId: payload.deviceId,
          siteId: payload.siteId,
          ts: payload.ts,
          reason,
          value: temperature > 50 ? temperature : humidity,
        });
      }
    }
  }

  async getLatest(deviceId: string) {
    const cached = await this.redis.get(`latest:${deviceId}`);
    if (cached) return JSON.parse(cached);
    return this.telemetryModel.findOne({ deviceId }).sort({ ts: -1 }).lean();
  }

  async getSummary(siteId: string, from: string, to: string) {
    return this.telemetryModel.aggregate([
      {
        $match: {
          siteId,
          ts: { $gte: new Date(from), $lte: new Date(to) },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgTemperature: { $avg: '$metrics.temperature' },
          maxTemperature: { $max: '$metrics.temperature' },
          avgHumidity: { $avg: '$metrics.humidity' },
          maxHumidity: { $max: '$metrics.humidity' },
          uniqueDevices: { $addToSet: '$deviceId' },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          avgTemperature: 1,
          maxTemperature: 1,
          avgHumidity: 1,
          maxHumidity: 1,
          uniqueDevices: { $size: '$uniqueDevices' },
        },
      },
    ]);
  }
}
