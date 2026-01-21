# Docker Setup

## Quick Start

```bash
# Jalankan semua services
docker compose up -d

# Jalankan migration
docker exec todoapp-web npx prisma migrate deploy

# Jalankan seeding (optional)
docker exec todoapp-web npm run seed
```

Akses app di: http://localhost:3000

## Test Login

- Email: john@example.com
- Password: password123

## Commands

```bash
# Stop semua
docker compose down

# Lihat logs
docker logs todoapp-web

# Rebuild image
docker compose build
```
