import 'dotenv/config';
import { Client, Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../dist/generated/prisma/client.js';

async function testPgTransaction(name, url) {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query('SELECT 1');
    await client.query('COMMIT');
    console.log(`${name} pg transaction: OK`);
    await client.end();
  } catch (error) {
    console.log(`${name} pg transaction: FAIL`, error.message);
  }
}

async function testPrismaTransaction(name, url, usePool, ssl) {
  const connectionOptions = {
    connectionString: url,
    ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
  };
  const adapter = usePool
    ? new PrismaPg(new Pool(connectionOptions))
    : new PrismaPg(connectionOptions);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1`;
    });
    console.log(`${name} prisma transaction (${usePool ? 'pool' : 'string'}, ssl=${ssl}): OK`);
    await prisma.$disconnect();
  } catch (error) {
    console.log(`${name} prisma transaction (${usePool ? 'pool' : 'string'}, ssl=${ssl}): FAIL`, error.message);
    try {
      await prisma.$disconnect();
    } catch {
      // ignore
    }
  }
}

for (const urlName of ['DIRECT_URL', 'DATABASE_URL']) {
  const url = process.env[urlName];
  await testPgTransaction(urlName, url);
  await testPrismaTransaction(urlName, url, false, false);
  await testPrismaTransaction(urlName, url, false, true);
  await testPrismaTransaction(urlName, url, true, true);
}
