import { env } from '@/lib/env.mjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { faker } from '@faker-js/faker';
import { wings } from './schema/wings';
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
  const wingsData: (typeof wings.$inferInsert)[] = [
    {
      name: 'Willows',
      description: 'Willows are a type of tree.',
    },
    { name: 'Oaks', description: 'Oaks are a type of tree.' },
    { name: 'Junipers', description: 'Junipers are a type of tree.' },
    { name: 'Acacias', description: 'Acacias are a type of tree.' },
    { name: 'Palms', description: 'Palms are a type of tree.' },
    { name: 'Myrtle', description: 'Myrtle are a type of tree.' },
  ];
  // for (let i = 0; i < 6; i++) {
  //   wingsData.push({
  //     name: faker.lorem.words(3),
  //     description: faker.lorem.words(10),
  //   });
  // }
  await db.insert(wings).values(wingsData);
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
