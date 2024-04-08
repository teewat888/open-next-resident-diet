'use server';
import { db } from '@/lib/db';
import { room, clientRoom } from '@/lib/db/schema';
import { and, eq, inArray, max, sql } from 'drizzle-orm';

export type AvailableRoom = {
  room_number: string;
  room_id: number;
  next_available_date: string | null;
};

export async function getAvailableRooms(wingId: string) {
  return await db
    .select({
      room_number: room.room_number,
      room_id: room.id,
      next_available_date: max(clientRoom.end_date),
    })
    .from(room)
    .leftJoin(
      clientRoom,
      and(
        eq(clientRoom.room_id, room.id),
        inArray(clientRoom.status, ['active', 'scheduled'])
      )
    )
    .where(eq(room.wing_id, parseInt(wingId)))
    .groupBy(room.id)
    .orderBy(sql`LPAD(room.room_number, 10, '0')`);
}
