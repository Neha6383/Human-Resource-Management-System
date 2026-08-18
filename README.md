# HRMS Project

This workspace contains the full HRMS backend and frontend scaffold for a Human Resource Management System.

## Included modules

- Authentication and JWT-based access control
- Admin, HR, and Employee dashboards
- Employee management
- Department management
- Attendance tracking
- Role management
- Login and protected routing

## Project structure

- `HrAPI/` - Express.js backend with PostgreSQL integration
- `HrDB/` - SQL schema for database setup
- `HrReact/` - React + Vite + Material UI frontend

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- A PostgreSQL database named `hrms`

## Database setup

1. Create a PostgreSQL database named `hrms`.
2. Open the SQL file at `HrDB/schema.sql` in pgAdmin or psql.
3. Run it to create the tables and seed initial departments and company settings.
4. Create a default admin user by running:

   ```bash
   cd HrAPI
   node scripts/seedAdmin.js
   ```

## Backend configuration

Create a `.env` file in `HrAPI/` with the following values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=hrms-super-secret-key
JWT_EXPIRES_IN=8h
PORT=5000
```

Then install and start the API:

```bash
cd HrAPI
npm install
npm run dev
```

The backend runs on:

- http://localhost:5000

## Frontend configuration

Create a `.env` file in `HrReact/` with:

```env
VITE_API_URL=http://localhost:5000/api
```

Then install and start the frontend:

```bash
cd HrReact
npm install
npm run dev
```

The frontend runs on:

- http://localhost:5173

## Default login accounts

- Admin: `admin@hrms.com` / `Admin@123`
- HR: `hr@hrms.com` / `Hr@123`
- Employee: `employee@hrms.com` / `Employee@123`

## Notes

- The login flow uses JWT tokens stored in local storage.
- Protected routes enforce access based on the logged-in role.
- The app is designed for a PostgreSQL-backed HR system and follows the schema in `HrDB/schema.sql`.
