import { pgTable, pgEnum, uuid, varchar } from 'drizzle-orm/pg-core';
import { UserRole } from "@enum/userRole";
import { enumToPgEnum } from "@src/helpers";

export const rolePgEnum = pgEnum('role', enumToPgEnum(UserRole));

export const userTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().unique(),
  passowrd: varchar(),
  name: varchar(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
  role: rolePgEnum().default(UserRole.USER)
})
