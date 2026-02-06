```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
# runs both formatting and linting checks using biome
npm run lint
npm run lint -- --fix --unsafe

npm run format
npx biome format
# color Slate
npx shadcn@latest init

npx shadcn@latest add @shadcn/navigation-menu
npx shadcn@latest add @shadcn/button
npx shadcn@latest add @shadcn/card

https://neon.com/
https://stack-auth.com/
# add the app domain to the trusted domains

npx @stackframe/init-stack@latest --no-browser

npm i drizzle-orm @neondatabase/serverless dotenv
npm i -D drizzle-kit drizzle-seed
// schema, index
npx drizzle-kit generate
npx drizzle-kit migrate

# npx drizzle-kit push
# If migrate fails with "relation \"articles\" already exists", the table was
# created earlier (e.g. by push). Mark the migration as applied once, then re-run migrate:
# scripts/mark-migration-applied.ts
npm run db:mark-applied && npm run db:migrate

# relation "neon_auth.users_sync" does not exist
# The seed script was updated so that it can run even when neon_auth.users_sync doesn’t exist:

npm i -D tsx

# create an project to vercel than deploy and add the env vars
# create a storage - blob and add the blob_base_url to env file
# from Settings - Enviroment variables copy blob read write token to blob_api_key in env
# update next.config.ts (remotePatterns)
npm i @vercel/blob

# set up redis on upstash then
npm i @upstash/redis
# create the cash folder - file
# set the env vars

# vercel - settings - integrations - broese marketplace - upstash - install
# configure with the existing upstash account
# integration - upstash - manage access
# check project name - settings - env vars - see the env vars

# # resend - settings - api keys - create api key
npm i resend @react-email/render

rm -rf .next node_modules/.cache
npm run dev
```

https://wikimasters-alpha.vercel.app/
