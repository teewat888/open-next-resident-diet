import { env } from '@/lib/env.mjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { faker } from '@faker-js/faker';
import { wing } from './schema/wing';
import { sql } from 'drizzle-orm';
import {
  MealSize,
  foodConsistency,
  liquidConsistency,
  mealSize,
  room,
} from './schema';

const runSeed = async () => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }
  //TODO seperate seed file for each db ?
  const connection = postgres(env.DATABASE_URL, { max: 1 });

  const db = drizzle(connection);

  console.log('⏳ Resetting database...');
  await db.execute(sql`TRUNCATE TABLE wing RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE room RESTART IDENTITY CASCADE`);
  await db.execute(
    sql`TRUNCATE TABLE food_consistency RESTART IDENTITY CASCADE`
  );
  await db.execute(
    sql`TRUNCATE TABLE liquid_consistency RESTART IDENTITY CASCADE`
  );
  await db.execute(sql`TRUNCATE TABLE meal_size RESTART IDENTITY CASCADE`);

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
  //Rooms data seed

  let roomId = 0;
  const willowRooms = Array.from({ length: 30 }, (_, i) => ({
    id: roomId++,
    room_number: `${i + 1}`,
    wing_id: 1,
  }));
  const oaksRooms = Array.from({ length: 30 }, (_, i) => ({
    id: roomId++,
    room_number: `${i + 1}`,
    wing_id: 2,
  }));
  const juniperRooms = Array.from({ length: 30 }, (_, i) => ({
    id: roomId++,
    room_number: `${i + 1}`,
    wing_id: 3,
  }));
  const acaciaRooms = Array.from({ length: 20 }, (_, i) => ({
    id: roomId++,
    room_number: `${i + 1}`,
    wing_id: 4,
  }));
  const palmRooms = Array.from({ length: 8 }, (_, i) => ({
    id: roomId++,
    room_number: `${i + 1}`,
    wing_id: 5,
  }));
  const myrtleRooms = Array.from({ length: 13 }, (_, i) => ({
    id: roomId++,
    room_number: `${i + 1}`,
    wing_id: 6,
  }));
  const roomsData: (typeof room.$inferInsert)[] = [
    ...willowRooms,
    ...oaksRooms,
    ...juniperRooms,
    ...acaciaRooms,
    ...palmRooms,
    ...myrtleRooms,
  ];
  await db.insert(room).values(roomsData);
  console.log('🌱 Seeded rooms data');
  //end Rooms data seed

  //Meals size data seed
  const mealsSizeData: MealSize[] = [
    {
      id: 1,
      size_name: 'Small',
      size_description: 'Small meal size',
    },
    {
      id: 2,
      size_name: 'Medium',
      size_description: 'Medium meal size',
    },
    {
      id: 3,
      size_name: 'Large',
      size_description: 'Large meal size',
    },
  ];
  await db.insert(mealSize).values(mealsSizeData);
  //end Meals size data seed
  // food consistency data seed
  const foodConsistencyData: (typeof foodConsistency.$inferInsert)[] = [
    {
      id: 1,
      food_consistency_name: 'Regular',
      food_consistency_symbol: 'R',
      food_consistency_description: 'Regular food consistency',
      food_consistency_color: 'rgb(0, 0, 0)',
    },
    {
      id: 2,
      food_consistency_name: 'Easy To Chew',
      food_consistency_symbol: 'S',
      food_consistency_description: 'Soft food consistency',
      food_consistency_color: 'rgb(0, 0, 0)',
    },
    {
      id: 3,
      food_consistency_name: 'Soft & Bite-Sized',
      food_consistency_symbol: 'P',
      food_consistency_description: 'Pureed food consistency',
      food_consistency_color: 'rgb(0, 103, 178)',
    },
    {
      id: 4,
      food_consistency_name: 'Mince & Moist',
      food_consistency_symbol: 'MS',
      food_consistency_description: 'Mechanical Soft food consistency',
      food_consistency_color: 'rgb(255, 102, 0)',
    },
    {
      id: 5,
      food_consistency_name: 'Pureed',
      food_consistency_symbol: 'C',
      food_consistency_description: 'Chopped food consistency',
      food_consistency_color: 'rgb(117, 182, 67)',
    },
    {
      id: 6,
      food_consistency_name: 'Liquidized',
      food_consistency_symbol: 'L',
      food_consistency_description: 'Liquidized food consistency',
      food_consistency_color: 'rgb(255, 255, 40)',
    },
  ];
  await db.insert(foodConsistency).values(foodConsistencyData);
  // end food consistency data seed
  // drink consistency data seed
  const drinkConsistencyData: (typeof liquidConsistency.$inferInsert)[] = [
    {
      id: 1,
      liquid_consistency_name: 'Thin',
      liquid_consistency_symbol: 'T',
      liquid_consistency_description: 'Thin liquid consistency',
      liquid_consistency_color: 'rgb(255, 255, 255)',
    },
    {
      id: 2,
      liquid_consistency_name: 'Slightly Thick',
      liquid_consistency_symbol: 'NT',
      liquid_consistency_description: 'Slightly Thick liquid consistency',
      liquid_consistency_color: 'rgb(102, 102, 102)',
    },
    {
      id: 3,
      liquid_consistency_name: 'Mildly Thick',
      liquid_consistency_symbol: 'HT',
      liquid_consistency_description: 'Mildly Thick liquid consistency',
      liquid_consistency_color: 'rgb(234, 78, 150)',
    },
    {
      id: 4,
      liquid_consistency_name: 'Moderately Thick',
      liquid_consistency_symbol: 'ST',
      liquid_consistency_description: 'Spoon Thick liquid consistency',
      liquid_consistency_color: 'rgb(255, 255, 40)',
    },
    {
      id: 5,
      liquid_consistency_name: 'Extremely Thick',
      liquid_consistency_symbol: 'VT',
      liquid_consistency_description: 'Extremely Thick liquid consistency',
      liquid_consistency_color: 'rgb(117, 182, 67)',
    },
  ];
  await db.insert(liquidConsistency).values(drinkConsistencyData);
  //end drink consistency data seed

  const end = Date.now();

  console.log('✅ Seed completed in', end - start, 'ms');

  process.exit(0);
};

runSeed().catch((err) => {
  console.error('❌ Seed failed');
  console.error(err);
  process.exit(1);
});
