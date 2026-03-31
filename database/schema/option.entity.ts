import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const optionTable = pgTable('options', {
  id: serial().primaryKey(),
  key: text(),
  value: text(),
});
