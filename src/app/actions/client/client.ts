'use server';

import { db } from '@/lib/db';
import { client, clientValidationSchema } from '@/lib/db/schema';
import {
  FormState,
  fromErrorToFormState,
  toFormState,
} from '@/lib/utils/fromErrorToFormState';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function createClient(formState: FormState, formData: FormData) {
  let insertedId;

  const file: File | null = formData.get('photo') as File;

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
        photo: file.name,
      })
      .returning({ insertedId: client.id });

    insertedId = insertResult[0].insertedId;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const path = join('./', 'public', 'uploads', file.name);
      await writeFile(path, buffer);
    }
  } catch (error) {
    console.log('catch error', error);
    return fromErrorToFormState(error);
  }

  return toFormState('SUCCESS', 'Client created successfully', insertedId);
}
