# FundsRoom ERP

FundsRoom ERP is a small manufacturing and supply workflow application for managing the journey from customer enquiry to dispatch.

```text
Customer Enquiry -> Quotation -> Sales Order -> Inventory Reservation -> Dispatch
```

The project uses a layered Node.js backend with Prisma and PostgreSQL, plus a React frontend for the primary workflow screens.

## Technology

- Node.js and Express.js
- PostgreSQL and Prisma ORM
- React and Vite
- JWT authentication
- bcrypt password hashing
- Backend role-based authorization
- Node.js test runner

## Project Structure

```text
fundsroom-erp/
├── client/                 React/Vite frontend
└── server/
	├── prisma/             Schema and migrations
	├── scripts/            Seed scripts
	├── src/
	│   ├── controllers/    HTTP request and response handling
	│   ├── middleware/     Authentication and role authorization
	│   ├── repositories/   Prisma database access
	│   ├── routes/         Express API routes
	│   ├── services/       Business rules, validation, calculations, and audits
	│   └── validations/    Request validation modules
	├── docs/               Postman collection and ER diagram
	└── tests/              Backend smoke tests
```

The backend follows:

```text
Route -> Controller -> Service -> Repository -> Prisma -> PostgreSQL
```

## Requirements

- Node.js 18 or newer
- PostgreSQL 14 or newer
- npm

## Backend Setup

From the `server` directory:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

Set the database connection and JWT secret in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fundsroom_erp?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
```

Apply migrations and generate Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Seed development data when required:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## Frontend Setup

From the `client` directory:

```bash
npm install
npm run dev
```

The Vite development server runs at `http://127.0.0.1:5173`.

The frontend connects to `http://localhost:5000/api` by default. To use another API URL, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Build the frontend for production:

```bash
npm run build
```

## Authentication

Login:

```http
POST /api/auth/login
```

```json
{
	"email": "admin@fundsroom.com",
	"password": "Admin@123"
}
```

Use the returned token on protected requests:

```http
Authorization: Bearer <token>
```

The backend enforces roles independently of frontend visibility:

- `ADMIN`: manage records, inventory, reservations, and dispatches
- `SALES_USER`: create and view sales workflow records according to route permissions

## API Modules

### Existing ERP modules

```text
/api/companies
/api/users
/api/departments
/api/employees
/api/customers
/api/products
/api/leads
/api/sales
/api/sale-items
/api/dashboard
/api/audit
```

### Case-study workflow modules

| Module | Endpoint | Purpose |
| --- | --- | --- |
| Inventory | `/api/inventory` | Physical, reserved, and available quantities |
| Enquiries | `/api/enquiries` | Customer demand and enquiry status |
| Quotations | `/api/quotations` | Calculated quotation totals and status |
| Sales orders | `/api/sales-orders` | Convert accepted quotations into orders |
| Reservations | `/api/inventory-reservations` | Reserve available stock transactionally |
| Dispatches | `/api/dispatches` | Dispatch reserved stock exactly once |

Standard CRUD routes are available for each case-study resource:

```text
POST   /api/<resource>
GET    /api/<resource>
GET    /api/<resource>/:id
PUT    /api/<resource>/:id
DELETE /api/<resource>/:id
```

Reports and search:

```text
GET /api/reports/search/:resource?q=&page=&limit=&sortBy=&sortOrder=
GET /api/reports/sales
GET /api/reports/customers
GET /api/reports/inventory
GET /api/reports/employee-sales
GET /api/reports/revenue
```

## Business Rules

- Quotation subtotal, discount, GST, and grand total are calculated by the backend.
- Only accepted quotations can become sales orders.
- A quotation can create only one sales order.
- Available inventory is calculated as `physicalQuantity - reservedQuantity`.
- Inventory reservations cannot exceed available stock.
- Reservation updates use a database transaction and conditional stock update to prevent concurrent over-reservation.
- Dispatch decreases both physical and reserved quantities.
- Cancelled or already dispatched orders cannot be dispatched.
- SaleItem create, update, and delete operations synchronize product stock transactionally.
- CREATE, UPDATE, and DELETE operations write audit logs in the service layer.
- GET operations do not create audit logs.

## Testing

Backend smoke tests:

```bash
cd server
npm test
```

Validation checks:

```bash
npx prisma validate
npx prisma migrate status
```

Frontend checks:

```bash
cd client
npm run build
npm run lint
```

The manual Postman workflow covers login, enquiry, quotation, quotation acceptance, sales order conversion, reservation, dispatch, duplicate dispatch protection, unauthorized access, and insufficient stock validation.

## Documentation

- [Postman collection](docs/postman-collection.json)
- [ER diagram](docs/ER-DIAGRAM.md)
- [Environment template](.env.example)

## Security Notes

- Never commit `.env` or database credentials.
- Passwords are stored as bcrypt hashes.
- JWTs are required for protected APIs.
- Role checks are enforced by backend middleware.
- Error responses expose a safe message rather than Prisma internals.

## Development Credentials

For local development only:

```text
Email: admin@fundsroom.com
Password: Admin@123
```

Change development credentials before using the application outside a local environment.
