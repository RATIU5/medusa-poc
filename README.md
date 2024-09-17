# medusa-poc

## Requirements

- OrbStack or Docker
- Node.js & pnpm & yarn

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/RATIU5/medusa-poc.git && cd medusa-poc
   ```

2. Setup the `.env` files

   ```bash
   cp .env.example .env
   cp ./packages/medusa/.env.example ./packages/medusa/.env
   cp ./packages/storefront/.env.example ./packages/storefront/.env
   cp ./packages/poverty/.env.example ./packages/poverty/.env
   ```

   Fill in the necessary values in the `.env` files.

3. Install dependencies

   ```bash
   pnpm install
   ```

4. Install package dependencies

   ```bash
   pnpm moon run :install
   ```

5. Install Go dependencies (need to have Go installed, version 1.23+)

   ```bash
   go install github.com/air-verse/air@latest
   go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
   ```

6. Start the database (skip this step if using production database)

   ```bash
   pnpm db:start
   ```

7. Start the dev server

   ```bash
   pnpm dev
   ```

8. Create an admin user for Medusa

   ```bash
   cd packages/medusa && pnpm medusa user --email john.doe@site.com --password super_secret_password && cd ../..
   ```

   \* Replace the email and password with your desired values

9. Create the admin user for Payload (first user only)

   - Navigate to `http://localhost:3000/admin` and create an admin user

### Documentation

[Medusa](./packages/medusa/README.md)
[Poverty](./packages/poverty/README.md)
[Storefront](./packages/storefront/README.md)

- [migrate Go CLI](https://github.com/golang-migrate/migrate?tab=readme-ov-file#cli-usage)

## Project Structure

The project is structured as a monorepo with the following packages inside the `packages` directory:

- `medusa`: The main Medusa e-commerce backend
- `storefront`: The Astro storefront
- `payload`: The Payload CMS for the Astro storefront

## Common Problems and Solutions

### Problem: relation "public.region_payment_provider" does not exist

**Description:**
When trying to run the migrations, you may come across an error similar to this:

```
message: `select "l0"."region_id", "l0"."payment_provider_id" from "public"."region_payment_provider" as "l0" where "l0"."deleted_at" is null and "l0"."region_id" in ('reg_01J812APGZB5QC215HSPRA0HE2') - relation "public.region_payment_provider" does not exist`,
```

**Solution:**

1. Make sure you have run the migrations and synced the links: `npx medusa migrations run && npx medusa links sync` within the `backend` package

**Additional Notes:**

This error is caused by the database not being able to find the `region_payment_provider` (or related) table. This table is created by the migrations, so running the migrations should resolve this issue.

---

### Problem: `medusa` Unable to acquire a connection

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

### Problem: `medusa` relation "public.payment_provider" does not exist

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

### Problem: `medusa` error: No database specified, please fill in `dbName` or `clientUrl` option

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

### Problem: `medusa` SSL required

When starting the development server, you may encounter an error similar to this:

```
error: Could not resolve module: PaymentModuleService. Error: Loaders for module PaymentModuleService failed: SSL required
```

**Solution:**

1. Make sure your database connection url ends with `?sslmode=no-verify`. This can be done by appending `?sslmode=no-verify` to the end of the database URL in the `.env` file.

**Additional Notes:**
This error is caused by the database not being able to connect properly due to SSL verification issues. Adding `?sslmode=no-verify` to the end of the database URL should resolve this issue by disabling SSL verification.

---

### Problem: `medusa` `pnpm moon run :install` freezes when installing dependencies

When trying to run `pnpm moon run :install`, you may encounter an issue where the installation process freezes. It will happen right round this step:

```
! Corepack is about to download https://registry.yarnpkg.com/yarn/-/yarn-1.22.22.tgz
```

**Solution:**

1. Press Return/Enter to accept the prompt to install the package. It's currently hidden at this step.

**Additional Notes:**
Because this is a monorepo that uses moonrepo, it won't display the prompt to install the package. Pressing Return/Enter will accept the prompt and continue the installation process.

---

### Problem: `medusa` Timeout aquiring a connection. The pool is probably full

When trying to run the development server, you may encounter an error similar to this:

```
Error Syncing the fulfillment providers: Knex: Timeout acquiring a connection. The pool is probably full. Are you missing a .transacting(trx) call?
```

**Solution:**

1. Increate the pool size of the database connection on DigitalOcean. This usually happens when running the database on DigitalOcean.
2. If that doesn't work, make sure your IP is added to DigitalOcean's Trusted Sources in the database settings.

**Additional Notes:**
This error is caused by the database not allowing certain IP addresses to connect to the database. Make sure your IP is added to the Trusted Sources in the database settings.

---

### Problem: `medusa` connect ECONNREFUSED x.x.x.x:25061

When trying to run the development server, you may encounter an error similar to this:

```
error: Could not resolve module: PaymentModuleService. Error: Loaders for module PaymentModuleService failed: connect ECONNREFUSED x.x.x.x:25061
```

**Solution:**

1. Make sure your database server is running
2. Make sure that no port is blocking access to the database
3. Make sure you are passing in your ENV connection string correctly `postgres://user:password@hostname:5432/dbname?sslmode=no-verify`

**Additional Notes:**
This error is caused by the database not being able to connect properly. Make sure your database server is running and that you are passing in the correct connection string.

---

### Problem: `payload` permission denied for schema public

When trying to run the development server, you may encounter an error similar to this from Payload:

```
error: permission denied for schema public
```

**Solution:**

1. Make sure you have the correct permissions set up for the database user you are using. You can do this by running the following commands in the database as an admin user:

   ```sql
   GRANT ALL ON SCHEMA public to payload;
   GRANT ALL ON DATABASE payload-db TO payload;
   ```

**Additional Notes:**
This error is caused by the database user not having the correct permissions to access the `public` schema. Granting the necessary permissions should resolve this issue.

---
