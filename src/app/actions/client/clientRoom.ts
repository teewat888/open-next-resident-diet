'use server';

import { db } from '@/lib/db';
import {
  clientRoom,
  clientRoomValidationSchema,
} from '@/lib/db/schema/clientRoom';
import {
  FormState,
  fromErrorToFormState,
} from '@/lib/utils/fromErrorToFormState';
import { Placeholder, SQL } from 'drizzle-orm';

export async function createClientRoom(
  formState: FormState,
  formData: FormData
) {
  try {
    const result = clientRoomValidationSchema.parse({
      client_id: formData.get('client_id'),
      room_id: Number(formData.get('room_id')),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      status: formData.get('status'),
    });
    await db.insert(clientRoom).values({
      client_id: result.client_id,
      room_id: result.room_id,
      start_date: result.start_date,
      end_date: result.end_date,
      status: result.status,
    });
  } catch (error) {
    return fromErrorToFormState(error);
  }
}
