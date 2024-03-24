import { generatePublicId, timestamps } from '@/lib/utils';
import { sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const wings = pgTable('wings', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => generatePublicId()),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

const baseSchema = createSelectSchema(wings).omit(timestamps);

export const insertWingSchema = createInsertSchema(wings).omit(timestamps);
export const insertWingParams = baseSchema.extend({}).omit({ id: true });

export const updateWingSchema = baseSchema;
export const updateWingParams = baseSchema.extend({}).omit({ id: true });
export const wingIdSchema = baseSchema.pick({ id: true });

export type Wing = typeof wings.$inferSelect;
export type NewWing = z.infer<typeof insertWingSchema>;
export type NewWingParams = z.infer<typeof insertWingParams>;
export type UpdateWingParams = z.infer<typeof updateWingParams>;
export type WingId = z.infer<typeof wingIdSchema>['id'];

export const wingValidationSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name is too long' }),
});
