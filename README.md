# TriggerHub

TriggerHub is a Zapier-like automation platform designed to handle event-driven workflows with a robust microservices architecture. It integrates with webhooks, Kafka for event streaming, and Prisma for database management.

## Description
TriggerHub is built to simplify complex automation workflows by allowing users to create custom triggers and actions seamlessly. The platform is structured with a microservices architecture, ensuring that each component (frontend, backend, hooks, processor, worker) operates independently for optimal performance and scalability. Leveraging the power of Kafka for real-time data streaming and Prisma ORM for efficient database interactions, TriggerHub offers a highly responsive and fault-tolerant environment. 

The platform supports:
- **Custom Webhooks:** Enabling integration with third-party APIs for dynamic data exchange.
- **Event Processing:** Kafka ensures real-time event streaming and processing with high throughput.
- **Workflow Automation:** Design and manage workflows through user-friendly interfaces, powered by Next.js and React.
- **Robust Data Management:** PostgreSQL and Prisma handle data integrity and scalability effortlessly.

## Features
- **Event-Driven Architecture:** Seamless handling of triggers and actions.
- **Microservices:** Decoupled services for better scalability.
- **Real-Time Processing:** Kafka-powered asynchronous message processing.
- **Flexible Webhooks:** Custom hooks for external integrations.
- **Secure Authentication:** JWT-based secure user authentication and authorization.
- **Fault Tolerance:** Ensures reliable event processing with Kafka consumer groups and retries.

##  Tech Stack
- **Frontend:** Next.js, React, TypeScript, TailwindCSS, Axios, React-flow
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Event Streaming:** Kafka
- **Database:** PostgreSQL with Prisma ORM
- **Dev Tools:** ESLint, TypeScript, Docker

## 📦 Installation
### Prerequisites
- Node.js
- PostgreSQL
- Kafka (for event streaming)

### Clone the Repository
```bash
git clone https://github.com/Amitaarav/TriggerHub.git
cd TriggerHub
```

### Install Dependencies
For **Frontend**:
```bash
cd frontend
npm install
```
For **Backend (Primary & Hooks)**:
```bash
cd primbackend
npm install

```
### Hooks
```
cd ../hooks
npm install
```
For **Processor & Worker**:
```bash
cd processor
npm install
cd ../worker
npm install
```

## ⚙️ Configuration
Create a `.env` file in each service directory with necessary environment variables:
```env
DATABASE_URL=your_postgresql_url
REDIS_URL=your_redis_url
KAFKA_BROKERS=localhost:9092
JWT_PASSWORD=your_secret_password
PORT=3000
```

## 🚀 Running the Application
### Start Kafka (Ensure Kafka is running locally or remotely)
```bash
# Start Kafka broker (if using Docker)
docker-compose up -d
```

### Start All Services
```bash
# Frontend
cd frontend
npm run dev

# Primary Backend
cd ../primbackend
npm run dev

# Hooks Backend
cd ../hooks
npm run dev

# Processor
cd ../processor
npm run dev

# Worker
cd ../worker
npm run dev
```

## 🧪 Running Tests
```bash
npm run test
```

## 🗂️ Project Structure
```
TriggerHub/
├── frontend/          # React + Next.js Frontend
├── primbackend/       # Primary Backend API
├── hooks/             # Webhook Management Service
├── processor/         # Kafka Event Processor
└── worker/            # Kafka Event Worker
```


## Hooks
- Hook trigger is built to shoot a webhook link. 

- Generally:
- Webhooks lets to talk two backend communicate. Take example of stripe or razorpay. Banks only provide its APIs to certain compony like razorpay or stripe and razorpay tells hdfs like bank backend server that here is the create secret url, whenever payment happens, please hit our webhook... hdfc bank beckend tells razorpay via webhook if payment is succeded.Even razorpay need to tell main backend of application.
## Processor
-Processor pushes data to kafka topic named "zap-events" with key "zap" and value as the event data. 

## Worker
-Worker pulls and listens to the "zap-events" topic and processes the events.


---

Made by [Amit Kumar Gupta](https://github.com/Amitaarav)


