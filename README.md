# 🧩 IoT Telemetry Ingestor

This project is a minimal IoT telemetry ingestor that accepts JSON readings, stores them in MongoDB, caches the latest values per device in Redis, and triggers alerts when thresholds are exceeded.

# ⚙️ Setup

## 1. Clone or unzip the project

## 2. Install dependencies

npm install


## 3. Add a .env file

MONGO_URI=mongodb:
REDIS_URL=redis:
ALERT_WEBHOOK_URL=
INGEST_TOKEN=

## 4. Start the app

npm run start:dev

# 🚀 API Endpoints

POST /api/v1/telemetry
GET /api/v1/devices/:deviceId/latest

# 🧪 Test Commands

npm run test
npm run test:e2e

# 🌐 Webhook

Alert URL used for testing:
👉 https://webhook.site/e933e5f2-7e3e-48ad-8f20-b90eba838274
