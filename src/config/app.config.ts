import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'Namly Backend',

  environment: process.env.NODE_ENV ?? 'development',

  port: Number(process.env.PORT ?? 3000),

  apiPrefix: process.env.API_PREFIX ?? 'api/v1',

  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  databaseUrl: process.env.DATABASE_URL,

  directDatabaseUrl: process.env.DIRECT_URL,
}));
