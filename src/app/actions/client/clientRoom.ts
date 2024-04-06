'use server';

import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import {
  clientRoom,
  clientRoomStatus,
  clientRoomValidationSchema,
} from '@/lib/db/schema/clientRoom';
import {
  FormState,
  fromErrorToFormState,
} from '@/lib/utils/fromErrorToFormState';

//clientRoomStatus: readonly ["active", "schduled", "completed", "cancelled"]
const getClientRoomStatus = ({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string | undefined;
}) => {
  console.log(start_date, end_date);
  return clientRoomStatus[0];
};

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
    const clientRoomStatus = getClientRoomStatus({
      start_date: result.start_date,
      end_date: result.end_date,
    });
    await db.insert(clientRoom).values({
      client_id: result.client_id,
      room_id: result.room_id,
      start_date: result.start_date,
      end_date: result.end_date,
      status: 'active',
    });
  } catch (error) {
    return fromErrorToFormState(error);
  }
}

export const isClientInRoom = async (clientId: string) => {
  const result = await db
    .select()
    .from(clientRoom)
    .where(eq(clientRoom.client_id, clientId))
    .limit(1);
  return result.length > 0 ? true : false;
};
