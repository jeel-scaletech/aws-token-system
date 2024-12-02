import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  email: varchar({ length: 255 }).primaryKey(),
  password: varchar({ length: 255 }).notNull(),
  userArn: varchar({ length: 255 }).notNull().unique(),
});

export const iamUsersTable = pgTable('iamUsers', {
  owner: varchar({ length: 255 })
    .references(() => usersTable.email, { onDelete: 'restrict' })
    .notNull(),
  username: varchar({ length: 255 }).primaryKey(),
});

export const iamCredsTable = pgTable('iamCredentials', {
  iamUser: varchar({ length: 255 }).references(() => iamUsersTable.username, {
    onDelete: 'cascade',
  }),
  accessKey: varchar({ length: 255 }).notNull(),
  secretKey: varchar({ length: 255 }).notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  iamAccounts: many(iamUsersTable),
}));

export const iamRelations = relations(iamUsersTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [iamUsersTable.owner],
    references: [usersTable.email],
  }),
}));

export const credRelations = relations(iamCredsTable, ({ one }) => ({
  owner: one(iamUsersTable, {
    fields: [iamCredsTable.iamUser],
    references: [iamUsersTable.username],
  }),
}));
