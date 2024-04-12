'use server';
import { db } from '@/lib/db';
import { mealSize, foodConsistency, liquidConsistency } from '@/lib/db/schema';

export async function getMealSize() {
  return await db.select().from(mealSize);
}

export async function getFoodConsistency() {
  return await db.select().from(foodConsistency);
}

export async function getLiquidConsistency() {
  return await db.select().from(liquidConsistency);
}
