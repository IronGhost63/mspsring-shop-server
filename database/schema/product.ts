import { pgTable, uuid, varchar, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const productTable = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: text(),
  unit_price: integer().default(0),
  stock: integer().default(0),
  created: timestamp().defaultNow().notNull()
}, (table) => [
  index('product_name_index').on(table.title)
]);

export type Product = InferSelectModel<typeof productTable>;
// export type InsertProduct = InferInsertModel<typeof productTable>;
