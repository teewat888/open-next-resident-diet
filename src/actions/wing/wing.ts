'use server';
import { db } from '@/lib/db';
import { wing } from '@/lib/db/schema';

export async function getWings() {
  return await db.select().from(wing);
}
