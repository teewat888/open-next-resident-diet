import { pgTable, text, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const drinkConsistencies = pgTable('drink_consistency', {
  id: serial('id').primaryKey(),
  drink_consistency_name: text('drink_consistency_name').notNull(),
  drink_consistency_symbol: text('drink_consistency_symbol').notNull(),
  drink_consistency_description: text('drink_consistency_description'),
});

const baseSchema = createSelectSchema(drinkConsistencies);

export const insertDrinkConsistencySchema =
  createInsertSchema(drinkConsistencies);
export const insertDrinkConsistencyParams = baseSchema
  .extend({})
  .omit({ id: true });

export const updateDrinkConsistencySchema = baseSchema;
export const updateDrinkConsistencyParams = baseSchema
  .extend({})
  .omit({ id: true });
export const drinkConsistencyIdSchema = baseSchema.pick({ id: true });

export type DrinkConsistency = typeof drinkConsistencies.$inferSelect;
export type NewDrinkConsistency = z.infer<typeof insertDrinkConsistencySchema>;
export type NewDrinkConsistencyParams = z.infer<
  typeof insertDrinkConsistencyParams
>;
export type UpdateDrinkConsistencyParams = z.infer<
  typeof updateDrinkConsistencyParams
>;
export type DrinkConsistencyId = z.infer<typeof drinkConsistencyIdSchema>['id'];

export const drinkConsistencyValidationSchema = z.object({
  // Add your validation schema here
});
