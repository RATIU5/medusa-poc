# test-medusa-1

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

3. Setup the `.env` files

   ```bash
   cp .env.example .env
   cp ./packages/backend/.env.example ./packages/backend/.env
   cp ./packages/storefront/.env.example ./packages/storefront/.env
   ```

   Fill in the necessary values in the `.env` files.

4. Start the database (skip this step if using production database)

   ```bash
   pnpm db:start
   ```

5. Start the dev server

   ```bash
   pnpm dev
   ```
