import { timestamps } from '@/lib/utils';
import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const clientAllergy = pgTable(
  'client_allergy',
  {
    client_id: text('client_id'),
    allergy_id: integer('allergy_id'),
    severity: text('severity'),
    createdAt: text('created_at').notNull().default('now()'),
    updatedAt: text('updated_at').notNull().default('now()'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.client_id, table.allergy_id] }),
      pkWithCustomName: primaryKey({
        name: 'client_allergy_pk',
        columns: [table.client_id, table.allergy_id],
      }),
    };
  }
);

const baseSchema = createSelectSchema(clientAllergy).omit(timestamps);

export const insertClientAllergySchema =
  createInsertSchema(clientAllergy).omit(timestamps);
export const insertClientAllergyParams = baseSchema.extend({});

export const updateClientAllergySchema = baseSchema;
export const updateClientAllergyParams = baseSchema.extend({});
export const ClientAllergyIdSchema = baseSchema.pick({
  client_id: true,
  allergy_id: true,
});

export type ClientAllergy = typeof clientAllergy.$inferSelect;
export type NewClientAllergy = z.infer<typeof insertClientAllergySchema>;
export type NewClientAllergyParams = z.infer<typeof insertClientAllergyParams>;
export type UpdateClientAllergyParams = z.infer<
  typeof updateClientAllergyParams
>;
export type ClientAllergyId = z.infer<typeof ClientAllergyIdSchema>[
  | 'client_id'
  | 'allergy_id'];

export const ClientAllergyValidationSchema = z.object({
  // Add your validation schema here
});
