import { env } from '@/lib/env.mjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { faker } from '@faker-js/faker';
import { wing } from './schema/wing';
import { sql } from 'drizzle-orm';

const runSeed = async () => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const connection = postgres(env.DATABASE_URL, { max: 1 });

  const db = drizzle(connection);

  console.log('⏳ Resetting database...');
  await db.execute(sql`TRUNCATE TABLE wings RESTART IDENTITY CASCADE`);

  console.log('⏳ Running seed...');

  const start = Date.now();

  //wings data seed
  const wingsData: (typeof wing.$inferInsert)[] = [
    { id: 1, name: 'Willows', description: 'Willows are a type of tree.' },
    { id: 2, name: 'Oaks', description: 'Oaks are a type of tree.' },
    { id: 3, name: 'Junipers', description: 'Junipers are a type of tree.' },
    { id: 4, name: 'Acacias', description: 'Acacias are a type of tree.' },
    { id: 5, name: 'Palms', description: 'Palms are a type of tree.' },
    { id: 6, name: 'Myrtle', description: 'Myrtle are a type of tree.' },
  ];

  await db.insert(wing).values(wingsData);
  console.log('🌱 Seeded wings data');
  //end wings data seed

  const end = Date.now();

  console.log('✅ Seed completed in', end - start, 'ms');

  process.exit(0);
};

runSeed().catch((err) => {
  console.error('❌ Seed failed');
  console.error(err);
  process.exit(1);
});
