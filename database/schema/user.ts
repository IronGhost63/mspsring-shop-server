import { pgTable, pgEnum, uuid, varchar } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { UserRole } from "@enum/userRole";
import { enumToPgEnum } from "@src/helpers";

export const rolePgEnum = pgEnum('role', enumToPgEnum(UserRole));

export const userTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().unique(),
  password: varchar(),
  name: varchar(),
  shippingAddress: varchar('shipping_address'),
  billingAddress: varchar('billing_address'),
  role: rolePgEnum().default(UserRole.USER)
})

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;
