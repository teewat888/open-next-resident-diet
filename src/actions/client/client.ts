'use server';

import { db } from '@/lib/db';
import { client, clientValidationSchema, mealSize } from '@/lib/db/schema';
import { fromErrorToFormState } from '@/lib/utils/fromErrorToFormState';
import { writeFile } from 'fs/promises';
import { count, eq } from 'drizzle-orm';
import { join } from 'path';
import { STATUS } from '@/constant';
import { revalidateClient } from '@/lib/utils/revalidate';

export async function createClient(formData: FormData) {
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
  revalidateClient();
  return {
    status: STATUS.SUCCESS,
    message: 'Client created successfully',
    id: insertedId,
  };
}

export async function getClientInfo(params: string) {
  return await db.select().from(client).where(eq(client.id, params)).limit(1);
}

export async function getAllClientInfo() {
  return await db
    .select()
    .from(client)
    .leftJoin(mealSize, eq(client.default_meal_size_id, mealSize.id));
}

export async function getTotalClientCount() {
  return await db.select({ count: count() }).from(client);
}
