import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { isTransientDbError } from './is-transient-db-error.util';

const MAX_QUERY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 100;

export function createResilientPrismaClient(databaseUrl: string): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 3,
    keepAlive: true,
    keepAliveInitialDelayMillis: 5_000,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 20_000,
  });

  const client = new PrismaClient({ adapter });

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          let lastError: unknown;

          for (let attempt = 1; attempt <= MAX_QUERY_ATTEMPTS; attempt++) {
            try {
              return await query(args);
            } catch (error) {
              lastError = error;

              if (attempt === MAX_QUERY_ATTEMPTS || !isTransientDbError(error)) {
                throw error;
              }

              await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            }
          }

          throw lastError;
        },
      },
    },
  }) as unknown as PrismaClient;
}
