import { pgTable, text, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const allergy = pgTable('allergy', {
  id: serial('id').primaryKey(),
  allergy_name: text('allergy_name').notNull(),
  allergy_description: text('allergy_description'),
});

const baseSchema = createSelectSchema(allergy);

export const insertAllergySchema = createInsertSchema(allergy);
export const insertAllergyParams = baseSchema.extend({}).omit({ id: true });

export const updateAllergySchema = baseSchema;
export const updateAllergyParams = baseSchema.extend({}).omit({ id: true });
export const allergyIdSchema = baseSchema.pick({ id: true });

export type Allergy = typeof allergy.$inferSelect;
export type NewAllergy = z.infer<typeof insertAllergySchema>;
export type NewAllergyParams = z.infer<typeof insertAllergyParams>;
export type UpdateAllergyParams = z.infer<typeof updateAllergyParams>;
export type AllergyId = z.infer<typeof allergyIdSchema>['id'];

export const allergyValidationSchema = z.object({
  // Add your validation schema here
});
