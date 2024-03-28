import { generatePublicId, timestamps } from '@/lib/utils';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const client = pgTable('client', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generatePublicId()),
  firstName: text('first_names').notNull(),
  lastName: text('last_name').notNull(),
  photo: text('photo'),
  meal_size_id: integer('meal_size_id').notNull(),
  food_consistency_id: integer('food_consistency_id').notNull(),
  liquid_consistency_id: integer('liquid_consistency_id').notNull(),
  createdAt: text('created_at').notNull().default('now()'),
  updatedAt: text('updated_at').notNull().default('now()'),
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
  meal_size_id: z.number().int().min(1, { message: 'Meal size is required' }),
  food_consistency_id: z
    .number()
    .int()
    .min(1, { message: 'Food consistency is required' }),
  liquid_consistency_id: z
    .number()
    .int()
    .min(1, { message: 'Liquid consistency is required' }),
});
