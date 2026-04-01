import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const optionTable = pgTable('options', {
  id: serial().primaryKey(),
  key: text(),
  value: text(),
});

export type Option = InferSelectModel<typeof optionTable>;
// export type InsertOption = InferInsertModel<typeof optionTable>;
