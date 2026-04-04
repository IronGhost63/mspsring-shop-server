import { pgTable, uuid, jsonb, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { userTable } from "@schema/user";

export const orderTable = pgTable('orders', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => userTable.id),
  items: jsonb().notNull(),
  total: integer(),
  discount: integer(),
  subtotal: integer(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
  created: timestamp().defaultNow(),
  modified: timestamp().defaultNow(),
}, (table) => [
  index('order_items_index').using('gin', table.items)
]);

export type Order = InferSelectModel<typeof orderTable>;
// export type InsertOrder = InferInsertModel<typeof orderTable>;
