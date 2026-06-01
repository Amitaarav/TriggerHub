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