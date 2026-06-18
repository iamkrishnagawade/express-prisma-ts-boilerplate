# Express TypeScript Boilerplate

## Docker Compose
### Setup docker-compose
```bash
docker-compose up -d --build
```

### Migrate
```bash
docker-compose exec api-server npx prisma migrate dev
```

### Prisma Studio
```bash
docker-compose exec api-server npx prisma studio
```

