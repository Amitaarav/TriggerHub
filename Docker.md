# Start just the cache container first
```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d npm-cache
```

# Then build everything, passing your machine's IP as the registry
# On Windows, use host.docker.internal which Docker Desktop resolves automatically
```
$env:COMPOSE_BAKE="true"
docker compose -f docker-compose.yml -f docker-compose.dev.yml build `
  --build-arg NPM_REGISTRY=http://host.docker.internal:4873
```

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Test the Local Event Pipeline

The processor and worker can run in Windows terminals while PostgreSQL and Kafka run in Docker. The development Kafka broker advertises `kafka:9092` to containers and `localhost:9094` to host processes. Use `kafka:9092` only from containers on the Compose network.

### Start Dependencies and Initialize Kafka

```powershell
docker compose -f docker-compose.dev.yml up -d db kafka kafka-init
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml exec kafka /opt/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

Confirm the output includes `zap-events` and that `db` and `kafka` are running and healthy.

### Check the Database Migrations

The processor uses `processor/.env` when run locally. Confirm its `DATABASE_URL` points to the same PostgreSQL database used by the application services.

```powershell
Push-Location .\processor
npx prisma migrate status
npx prisma migrate deploy
Pop-Location
```

Run `migrate deploy` when status reports pending migrations. The outbox migration creates `ZapRunOutbox` and adds the `processed` and `createdAt` fields used by the processor.

### Build and Start the Services

Build each service to catch TypeScript or Prisma client issues:

```powershell
Push-Location .\processor
npm run build
Pop-Location
Push-Location .\worker
npm run build
Pop-Location
```

Start these in separate terminals from the repository root:

```powershell
Push-Location .\processor
npm run dev
```

```powershell
Push-Location .\worker
npm run dev
```

Host-run services default to `localhost:9094`. To override the broker in a terminal, set `$env:KAFKA_BROKERS = "localhost:9094"` before starting the service. Compose-run services use `kafka:9092` automatically.

### Exercise the Pipeline

Trigger one test Zap through the application or webhook endpoint. Confirm the processor stays connected and publishes to `zap-events`, then confirm the worker logs that it joined `main-worker` and handles the message. The worker should not report `ENOTFOUND kafka` when run on the host.

An initial `The group coordinator is not available` response can occur while Kafka is starting or a consumer group is rebalancing. It is recoverable when followed by `Consumer has joined the group`; investigate further if the worker never joins or repeatedly loses its connection.

The KafkaJS partitioner warning is avoided by explicitly selecting `Partitioners.LegacyPartitioner` in both producers. Restart the processor and worker after changing their producer configuration.

### Troubleshooting

- `The table public.ZapRunOutbox does not exist`: the processor's database has not received its migrations, or its `DATABASE_URL` points at a different database. Check `npx prisma migrate status` from `processor` and apply pending migrations with `npx prisma migrate deploy`.
- `getaddrinfo ENOTFOUND kafka`: a host-run process is using the Docker-only broker address. Use `localhost:9094`; reserve `kafka:9092` for containers attached to the Compose network.
- Kafka stays `unhealthy` or `kafka-init` fails: the Kafka image's scripts are under `/opt/kafka/bin`. The dev Compose health check and topic initializer use that path. Recreate the broker and rerun initialization after changing the Compose config:

  ```powershell
  docker compose -f docker-compose.dev.yml up -d --force-recreate kafka
  docker compose -f docker-compose.dev.yml up -d --force-recreate kafka-init
  docker compose -f docker-compose.dev.yml ps kafka kafka-init
  ```

- `The group coordinator is not available`: check Kafka startup and consumer-group logs. A later `Consumer has joined the group` message confirms recovery.