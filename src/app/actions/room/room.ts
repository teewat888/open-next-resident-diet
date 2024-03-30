'use server';
import { db } from '@/lib/db';
import { room } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getAvailableRooms(wingId: string) {
  return await db
    .select()
    .from(room)
    .where(eq(room.wing_id, parseInt(wingId)));
}
