import { pgTable, uuid, jsonb, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { userTable } from "@schema/user";

export const orderTable = pgTable('orders', {
  id: uuid().primaryKey(),
  userId: uuid('user_id').references(() => userTable.id),
  items: jsonb().notNull(),
  total: integer(),
  discount: integer(),
  subtotal: integer(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
  created: timestamp(),
  modified: timestamp(),
}, (table) => [
  index('order_items_index').using('gin', table.items)
]);
