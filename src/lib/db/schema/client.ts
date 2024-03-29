import { generatePublicId, timestamps } from '@/lib/utils';
import { sql } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const client = pgTable('client', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generatePublicId()),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  photo: text('photo'),
  default_meal_size_id: integer('meal_size_id'),
  default_food_consistency_id: integer('food_consistency_id'),
  default_liquid_consistency_id: integer('liquid_consistency_id'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

const baseSchema = createSelectSchema(client).omit(timestamps);

export const insertClientSchema = createInsertSchema(client).omit(timestamps);
export const insertClientParams = baseSchema.extend({}).omit({ id: true });

export const updateClientSchema = baseSchema;
export const updateClientParams = baseSchema.extend({}).omit({ id: true });
export const clientIdSchema = baseSchema.pick({ id: true });

export type Client = typeof client.$inferSelect;
export type NewClient = z.infer<typeof insertClientSchema>;
export type NewClientParams = z.infer<typeof insertClientParams>;
export type UpdateClientParams = z.infer<typeof updateClientParams>;
export type ClientId = z.infer<typeof clientIdSchema>['id'];

export const clientValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(255, { message: 'First name is too long' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(255, { message: 'Last name is too long' }),
});
