import { pgTable, text, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const foodConsistency = pgTable('food_consistency', {
  id: serial('id').primaryKey(),
  food_consistency_name: text('food_consistency_name').notNull(),
  food_consistency_symbol: text('food_consistency_symbol').notNull(),
  food_consistency_description: text('food_consistency_description'),
});

const baseSchema = createSelectSchema(foodConsistency);

export const insertFoodConsistencySchema = createInsertSchema(foodConsistency);
export const insertFoodConsistencyParams = baseSchema
  .extend({})
  .omit({ id: true });

export const updateFoodConsistencySchema = baseSchema;
export const updateFoodConsistencyParams = baseSchema
  .extend({})
  .omit({ id: true });
export const foodConsistencyIdSchema = baseSchema.pick({ id: true });

export type FoodConsistency = typeof foodConsistency.$inferSelect;
export type NewFoodConsistency = z.infer<typeof insertFoodConsistencySchema>;
export type NewFoodConsistencyParams = z.infer<
  typeof insertFoodConsistencyParams
>;
export type UpdateFoodConsistencyParams = z.infer<
  typeof updateFoodConsistencyParams
>;
export type FoodConsistencyId = z.infer<typeof foodConsistencyIdSchema>['id'];

export const foodConsistencyValidationSchema = z.object({
  // Add your validation schema here
});
