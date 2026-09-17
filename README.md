# FundsRoom ERP Backend

Node.js, Express, Prisma, PostgreSQL backend for the FundsRoom ERP case study.

## Setup

```bash
cd server
npm install
copy .env.example .env
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run dev
```

Set `DATABASE_URL` and `JWT_SECRET` in `.env`. Never commit `.env`.

## Authentication

Register with `POST /api/auth/register`, then login with `POST /api/auth/login`. Send the returned token as `Authorization: Bearer <token>`.

## APIs

Existing modules: auth, companies, users, departments, employees, customers, products, leads, sales, sale-items, dashboard, and audit.

Case-study modules:

- `/api/inventory`
- `/api/enquiries`
- `/api/quotations`
- `/api/sales-orders`
- `/api/inventory-reservations`
- `/api/dispatches`
- `/api/reports/search/:resource`
- `/api/reports/sales`, `/customers`, `/inventory`, `/employee-sales`, `/revenue`

All mutation routes require authentication and role authorization. CREATE, UPDATE, and DELETE operations write audit logs in services. Reservation and dispatch operations use database transactions.

## Testing

```bash
npx prisma validate
npx prisma migrate status
npm test
```

See `docs/postman-collection.json` for a starter API collection and `docs/ER-DIAGRAM.md` for the current data model.
