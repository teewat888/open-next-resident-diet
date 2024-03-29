import { timestamps } from '@/lib/utils';
import { sql } from 'drizzle-orm';

import { pgTable, text, integer, bigserial, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const statusEnum = pgEnum('status', [
  'active',
  'schduled',
  'completed',
  'cancelled',
]);

export const clientRoom = pgTable('client_room', {
  client_room_id: bigserial('client_room_id', { mode: 'bigint' }).primaryKey(),
  client_id: text('client_id'),
  room_id: integer('room_id'),
  start_date: text('start_date').notNull(),
  end_date: text('end_date'),
  status: statusEnum('status'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

const baseSchema = createSelectSchema(clientRoom).omit(timestamps);

export const insertClientRoomSchema =
  createInsertSchema(clientRoom).omit(timestamps);
export const insertClientRoomParams = baseSchema
  .extend({})
  .omit({ client_room_id: true });

export const updateClientRoomSchema = baseSchema;
export const updateClientRoomParams = baseSchema
  .extend({})
  .omit({ client_room_id: true });
export const clientRoomIdSchema = baseSchema.pick({ client_room_id: true });

export type ClientRoom = typeof clientRoom.$inferSelect;
export type NewClientRoom = z.infer<typeof insertClientRoomSchema>;
export type NewClientRoomParams = z.infer<typeof insertClientRoomParams>;
export type UpdateClientRoomParams = z.infer<typeof updateClientRoomParams>;
export type ClientRoomId = z.infer<typeof clientRoomIdSchema>['client_room_id'];

export const clientRoomValidationSchema = z.object({
  // Add your validation schema here
});
