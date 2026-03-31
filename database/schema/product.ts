import { pgTable, uuid, varchar, text, integer, index } from 'drizzle-orm/pg-core';

export const productTable = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: text(),
  unit_price: integer().default(0),
  stock: integer().default(0),
}, (table) => [
  index('product_name_index').on(table.title)
]);
