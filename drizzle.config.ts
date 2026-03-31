import { defineConfig } from 'drizzle-kit';

const dbUrl = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`;

console.log(dbUrl);

export default defineConfig({
  out: './database/migrations',
  schema: ['./database/schema'],
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
});
