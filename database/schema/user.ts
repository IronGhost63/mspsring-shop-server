import { pgTable, pgEnum, uuid, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const userTable = pgTable('users', {
  id: uuid().primaryKey(),
  email: varchar().unique(),
  passowrd: varchar(),
  name: varchar(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
  role: roleEnum().default('user')
})
