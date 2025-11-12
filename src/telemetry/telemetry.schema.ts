import { Schema } from 'mongoose';

export const TelemetrySchema = new Schema({
  deviceId: String,
  siteId: String,
  ts: Date,
  metrics: {
    temperature: Number,
    humidity: Number,
  },
});
