import { ConfigService } from "@nestjs/config";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from "database/schema";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [{
  provide: DrizzleAsyncProvider,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const dbUser = configService.get<string>('POSTGRES_USER');
    const dbPassword = configService.get<string>('POSTGRES_PASSWORD');
    const dbName = configService.get<string>('POSTGRES_DB');

    const dbUrl = `postgres://${dbUser}:${dbPassword}@localhost:5432/${dbName}`;

    const pool = new Pool({
      connectionString: dbUrl,
    });

    return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
  },
}];
