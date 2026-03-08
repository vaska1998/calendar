# Calendar — project run guide

This README explains how to run the frontend and backend locally and with Docker (using docker-compose). It includes quick start steps, environment variable examples, and troubleshooting tips.

---

## Overview
- frontend: the `frontend` folder (Vite + React). Production assets are served by nginx in Docker.
- backend: the `server` folder (NestJS). Production image runs `node dist/main.js`.

The project is configured to use an external MongoDB (via the `MONGO_URI` environment variable). By default, `docker-compose` does not start a local MongoDB.

---

## Requirements
- Docker Desktop with Docker Compose (v2)
- (for local development) Node.js 20.x and npm

---

## Configuration files
- `.env` — environment variables file.

Example `.env.example` (create a local `.env` from this template):

MONGO_URI=mongodb+srv://<user>:<password>@cluster.example.mongodb.net/<db>
MONGODB_URI=${MONGO_URI}
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_HOST_PORT=8080
VITE_API_BASE_URL=http://backend:3000/api

---

## Run with Docker (recommended)

1. Create a local `.env` in the repository root based on `env.example` and fill in values (MONGO_URI, etc.).

2. Start the stack (frontend + backend):

```powershell
docker compose up --build -d
```

3. Check running containers:

```powershell
docker compose ps
```

4. Tail logs (real-time):

```powershell
docker compose logs -f frontend
docker compose logs -f backend
```

5. Stop and remove the stack:

```powershell
docker compose down
```

Notes:
- The `backend` service in `docker-compose.yml` is configured with `expose: 3000` (internal port only). To access the backend from your host machine (e.g. Postman), add the following to the `backend` service and restart compose:

```yaml
ports:
  - "3000:3000"
```

- Frontend is available at `http://localhost:${FRONTEND_HOST_PORT}` (default 8080).
- The frontend's API base URL is injected at build time using `VITE_API_BASE_URL` (passed as a build-arg and runtime env in `docker-compose.yml`).

---

## Local development (run services individually)

### Frontend (Vite dev server)

1. Change into the `frontend` folder:

```powershell
cd frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

4. The dev server is usually available at `http://localhost:5173`. To point the frontend to a local backend, set `VITE_API_BASE_URL` in a local env (for example `http://localhost:3000/api`).

### Backend (NestJS)

1. Change into the `server` folder:

```powershell
cd server
```

2. Install dependencies:

```powershell
npm install
```

3. Start in development mode (watch):

```powershell
npm run start:dev
```

4. Production build and run locally:

```powershell
npm run build
node dist/main.js
```

5. The backend reads `MONGO_URI` (or `MONGODB_URI`) from environment variables. You can create a `server/.env` or set the env variable before running:

```powershell
$env:MONGO_URI = "mongodb+srv://..."
npm run start:dev
```

---

## Useful docker-compose commands

- Build images without starting:

```powershell
docker compose build
```

- Rebuild + start only a single service:

```powershell
docker compose up -d --build frontend
docker compose up -d --build backend
```

- Tail logs for all services:

```powershell
docker compose logs -f
```

- Remove images created by compose (careful):

```powershell
docker compose down --rmi all
```
