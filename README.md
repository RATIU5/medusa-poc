# medusa-poc

## Requirements

- OrbStack or Docker
- Node.js & pnpm

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/RATIU5/medusa-poc.git && cd medusa-poc
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Install package dependencies

   ```bash
   pnpm moon run :install
   ```

4. Setup the `.env` files

   ```bash
   cp .env.example .env
   cp ./packages/medusa/.env.example ./packages/medusa/.env
   cp ./packages/storefront/.env.example ./packages/storefront/.env
   ```

   Fill in the necessary values in the `.env` files.

5. Start the database (skip this step if using production database)

   ```bash
   pnpm db:start
   ```

6. Start the dev server

   ```bash
   pnpm dev
   ```

## Common Problems and Solutions

### Problem: Unable to acquire a connection

**Description:**
When trying to run the migrations, you may come across an error similar to this:

```
error: Could not resolve module: cartCartPaymentPaymentCollectionLink. Error: Loaders for module cartCartPaymentPaymentCollectionLink failed: Unable to acquire a connection
```

**Solution:**
The database could not connect properly.
Ensure that the database URL ends with `?sslmode=no-verify`. This can be done by appending `?sslmode=no-verify` to the end of the database URL in the `.env` file.

**Additional Notes:**
This error is caused by the database not being able to connect properly due to SSL verification issues. Adding `?sslmode=no-verify` to the end of the database URL should resolve this issue.

---

### Problem: relation "public.payment_provider" does not exist

**Description:**
When trying to start your development server, you may encounter an error similar to this:

```
error: Could not resolve module: PaymentModuleService. Error: Loaders for module PaymentModuleService failed: select "p0".\* from "public"."payment_provider" as "p0" where "p0"."id" in ('pp_system_default') - relation "public.payment_provider" does not exist
```

**Solution:**

1. Make sure your database server is running
2. Make sure you are passing in your ENV connection string correctly `postgres://user:password@hostname:5432/dbname?sslmode=no-verify`
3. Make sure you have run the migrations and synced the links: `npx medusa migrations run && npx medusa links sync` within the `medusa` package

**Additional Notes:**
This error is caused by the database not being able to find the `payment_provider` (or related) table. This table is created by the migrations, so running the migrations should resolve this issue.

---

### Problem: error: No database specified, please fill in `dbName` or `clientUrl` option

**Description:**
When trying to run the development server, you may encounter an error similar to this:

```
error: Could not resolve module: WorkflowsModuleService. Error: Loaders for module WorkflowsModuleService failed: No database specified, please fill in `dbName` or `clientUrl` option
```

**Solution:**

1. Make sure you copied all the `.env.template` files to `.env` files:
   ```
   cp .env.example .env
   cp ./packages/medusa/.env.example ./packages/medusa/.env
   cp ./packages/storefront/.env.example ./packages/storefront/.env
   ```
2. Make sure you fill out the correct env variables in the `.env` files

**Additional Notes:**
This error is caused by the database not being able to connect properly due to missing database information in the `.env` files. Make sure you have filled out the necessary values in the `.env` files.

---

### Problem: SSL required

When starting the development server, you may encounter an error similar to this:

```
error: Could not resolve module: PaymentModuleService. Error: Loaders for module PaymentModuleService failed: SSL required
```

**Solution:**

1. Make sure your database connection url ends with `?sslmode=no-verify`. This can be done by appending `?sslmode=no-verify` to the end of the database URL in the `.env` file.

**Additional Notes:**
This error is caused by the database not being able to connect properly due to SSL verification issues. Adding `?sslmode=no-verify` to the end of the database URL should resolve this issue by disabling SSL verification.

---
