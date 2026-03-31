import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: uuid().primaryKey(),
  email: varchar().unique(),
  passowrd: varchar(),
  name: varchar(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
})
