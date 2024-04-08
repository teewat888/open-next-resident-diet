import { timestamps } from '@/lib/utils';
import { sql } from 'drizzle-orm';

import { pgTable, text, integer, bigserial, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { client } from './client';
import { room } from './room';
import { DISCHARGE_DATE_MUST_GREATER_THAN_ADMIT_DATE } from '@/constant/validation';

export const clientRoomStatus = [
  'active',
  'scheduled',
  'completed',
  'cancelled',
] as const;
export const statusEnum = pgEnum('status', clientRoomStatus);

export const clientRoom = pgTable('client_room', {
  client_room_id: bigserial('client_room_id', { mode: 'bigint' }).primaryKey(),
  client_id: text('client_id').references(() => client.id),
  room_id: integer('room_id').references(() => room.id),
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

export const clientRoomValidationSchema = z
  .object({
    client_id: z.string(),
    room_id: z.number(),
    start_date: z.string(),
    end_date: z.string().optional().nullable(),
    status: z.enum(clientRoomStatus),
  })
  .refine(
    (data) => {
      if (data.end_date && data.start_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return startDate < endDate;
      }
      return true;
    },
    {
      message: DISCHARGE_DATE_MUST_GREATER_THAN_ADMIT_DATE,
      path: ['end_date'],
    }
  );
