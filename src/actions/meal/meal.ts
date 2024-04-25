'use server';

import { STATUS } from '@/constant';
import { db } from '@/lib/db';
import {
  mealSize,
  foodConsistency,
  liquidConsistency,
  client,
  mealSchema,
} from '@/lib/db/schema';
import { fromErrorToFormState } from '@/lib/utils/fromErrorToFormState';
import { eq } from 'drizzle-orm';

export async function getMealSize() {
  return await db.select().from(mealSize);
}

export async function getFoodConsistency() {
  return await db.select().from(foodConsistency);
}

export async function getLiquidConsistency() {
  return await db.select().from(liquidConsistency);
}

export async function updateMealConsistency(
  formData: FormData,
  clientId: string
) {
  try {
    const result = mealSchema.parse({
      default_meal_size_id: Number(formData.get('default_meal_size_id')),
      default_food_consistency_id: Number(
        formData.get('default_food_consistency_id')
      ),
      default_liquid_consistency_id: Number(
        formData.get('default_liquid_consistency_id')
      ),
    });
    const updateDefaultMeal = await db
      .update(client)
      .set({
        default_meal_size_id: result.default_meal_size_id,
        default_food_consistency_id: result.default_food_consistency_id,
        default_liquid_consistency_id: result.default_liquid_consistency_id,
      })
      .where(eq(client.id, clientId));
  } catch (error) {
    console.log(error);
    return fromErrorToFormState(error);
  }
  return {
    status: STATUS.SUCCESS,
    message: 'Client created successfully',
    id: clientId,
  };
}
