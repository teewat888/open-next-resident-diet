import { integer, pgTable, serial, smallint, text } from 'drizzle-orm/pg-core';
import { wing } from './wing';
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { timestamps } from '@/lib/utils';

export const room = pgTable('room', {
  id: serial('id').primaryKey(),
  room_number: text('room_number').notNull(),
  capacity: smallint('capacity').notNull().default(1),
  wing_id: integer('wing_id').references(() => wing.id),
  createdAt: text('created_at').notNull().default('now()'),
  updatedAt: text('updated_at').notNull().default('now()'),
});

const baseSchema = createSelectSchema(room).omit(timestamps);

export const insertRoomSchema = createInsertSchema(room).omit(timestamps);
export const insertRoomParams = baseSchema.extend({}).omit({ id: true });

export const updateRoomSchema = baseSchema;
export const updateRoomParams = baseSchema.extend({}).omit({ id: true });
export const roomIdSchema = baseSchema.pick({ id: true });

export type Room = typeof room.$inferSelect;
export type NewRoom = z.infer<typeof insertRoomSchema>;
export type NewRoomParams = z.infer<typeof insertRoomParams>;
export type UpdateRoomParams = z.infer<typeof updateRoomParams>;
export type RoomId = z.infer<typeof roomIdSchema>['id'];

export const roomValidationSchema = z.object({
  room_number: z
    .string()
    .min(1, { message: 'Room number is required' })
    .max(255, { message: 'Room number is too long' }),
  capacity: z.number().int().min(1, { message: 'Capacity must be at least 1' }),
  wing_id: z.number().int().min(1, { message: 'Wing ID is required' }),
});
