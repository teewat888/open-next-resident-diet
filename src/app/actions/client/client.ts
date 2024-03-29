'use server';

import { db } from '@/lib/db';
import { client, clientValidationSchema } from '@/lib/db/schema';
import {
  FormState,
  fromErrorToFormState,
  toFormState,
} from '@/lib/utils/fromErrorToFormState';

export async function createClient(formState: FormState, formData: FormData) {
  let insertedId;
  try {
    const result = clientValidationSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
    });
    const insertResult = await db
      .insert(client)
      .values({
        firstName: result.firstName,
        lastName: result.lastName,
      })
      .returning({ insertedId: client.id });

    insertedId = insertResult[0].insertedId;
  } catch (error) {
    console.log('catch error', error);
    return fromErrorToFormState(error);
  }

  return toFormState('SUCCESS', 'Client created successfully', insertedId);
}
