import { pgTable, text, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const liquidConsistency = pgTable('liquid_consistency', {
  id: serial('id').primaryKey(),
  liquid_consistency_name: text('liquid_consistency_name').notNull(),
  liquid_consistency_symbol: text('liquid_consistency_symbol').notNull(),
  liquid_consistency_description: text('liquid_consistency_description'),
  liquid_consistency_color: text('liquid_consistency_color'),
});

const baseSchema = createSelectSchema(liquidConsistency);

export const insertLiquidConsistencySchema =
  createInsertSchema(liquidConsistency);
export const insertLiquidConsistencyParams = baseSchema
  .extend({})
  .omit({ id: true });

export const updateLiquidConsistencySchema = baseSchema;
export const updateLiquidConsistencyParams = baseSchema
  .extend({})
  .omit({ id: true });
export const liquidConsistencyIdSchema = baseSchema.pick({ id: true });

export type LiquidConsistency = typeof liquidConsistency.$inferSelect;
export type NewLiquidConsistency = z.infer<
  typeof insertLiquidConsistencySchema
>;
export type NewDrinkConsistencyParams = z.infer<
  typeof insertLiquidConsistencyParams
>;
export type UpdateLiquidConsistencyParams = z.infer<
  typeof updateLiquidConsistencyParams
>;
export type DrinkConsistencyId = z.infer<
  typeof liquidConsistencyIdSchema
>['id'];

export const liquidConsistencyValidationSchema = z.object({
  // Add your validation schema here
});
