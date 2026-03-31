import { pgTable, uuid, json, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { userTable } from "@schema/user";

export const orderTable = pgTable('orders', {
  id: uuid().primaryKey(),
  userId: uuid('user_id').references(() => userTable.id),
  items: json(),
  total: integer(),
  discount: integer(),
  subtotal: integer(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
  created: timestamp(),
  modified: timestamp(),
}, (table) => [
  index('order_items_index').on(table.items).using('gin')
]);
