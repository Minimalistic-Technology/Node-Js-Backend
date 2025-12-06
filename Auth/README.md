# Auth Service

Standalone Node.js + Express + MongoDB service that powers authentication, RBAC, blog/quote management, audit logging, and profile endpoints.

## Setup

```bash
cd Auth
npm install
cp .env.example .env   # update values
```

## Available Scripts

- `npm run dev` – Start the service in watch mode using `tsx`.
- `npm run build` – Compile TypeScript to `dist/`.
- `npm start` – Run the compiled JavaScript from `dist/`.

## Environment

Required variables:

- `PORT` – HTTP port (defaults to `4000` if unset).
- `MONGO_URI` – MongoDB connection string.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` – Token signing secrets.
- `ACCESS_TOKEN_EXPIRE` / `REFRESH_TOKEN_EXPIRE` – Token expirations (e.g., `15m`, `7d`).
- `CORS_ORIGIN` – Comma-separated whitelist of allowed origins.

Optional SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_MAIL`, `SMTP_PASSWORD`) enable transactional emails.






