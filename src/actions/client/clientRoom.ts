'use server';

import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import {
  clientRoom,
  clientRoomValidationSchema,
} from '@/lib/db/schema/clientRoom';
import {
  FormState,
  fromErrorToFormState,
  toFormState,
} from '@/lib/utils/fromErrorToFormState';
import { STATUS } from '@/constant';

export async function createClientRoom(formData: FormData) {
  let clientId;
  try {
    const result = clientRoomValidationSchema.parse({
      client_id: formData.get('client_id'),
      room_id: Number(formData.get('room_id')),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      status: formData.get('status'),
    });
    clientId = result.client_id;
    await db.insert(clientRoom).values({
      client_id: result.client_id,
      room_id: result.room_id,
      start_date: result.start_date,
      end_date: result.end_date,
      status: result.status,
    });
  } catch (error) {
    console.log('catch error', error);
    return fromErrorToFormState(error);
  }
  return {
    status: STATUS.SUCCESS,
    message: 'Room config successfully',
    id: clientId,
  };
}

export const isClientInRoom = async (clientId: string) => {
  const result = await db
    .select()
    .from(clientRoom)
    .where(eq(clientRoom.client_id, clientId))
    .limit(1);
  return result.length > 0 ? true : false;
};
