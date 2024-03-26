import { pgTable, text, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const mealSize = pgTable('meal_size', {
  id: serial('id').primaryKey(),
  size_name: text('size_name').notNull(),
  size_description: text('size_description'),
});

const baseSchema = createSelectSchema(mealSize);

export const insertMealSizeSchema = createInsertSchema(mealSize);
export const insertMealSizeParams = baseSchema.extend({}).omit({ id: true });

export const updateMealSizeSchema = baseSchema;
export const updateMealSizeParams = baseSchema.extend({}).omit({ id: true });
export const mealSizeIdSchema = baseSchema.pick({ id: true });

export type MealSize = typeof mealSize.$inferSelect;
export type NewMealSize = z.infer<typeof insertMealSizeSchema>;
export type NewMealSizeParams = z.infer<typeof insertMealSizeParams>;
export type UpdateMealSizeParams = z.infer<typeof updateMealSizeParams>;
export type MealSizeId = z.infer<typeof mealSizeIdSchema>['id'];

export const mealSizeValidationSchema = z.object({
  // Add your validation schema here
});
