import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, int } from "drizzle-orm/sqlite-core";

const userRole = text("role", { enum: ["admin", "user"] }).default("user");

const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
  role: userRole,
});

const usersRelations = relations(userTable, ({ many }) => ({
  links: many(linkTable),
}));

const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

const linkTable = sqliteTable("link", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  slug: text("slug").notNull().unique(),
  target: text("target").notNull(),
});

const linksRelations = relations(linkTable, ({ one }) => ({
  owner: one(userTable, {
    fields: [linkTable.userId],
    references: [userTable.id],
  }),
}));

const serverSettingTable = sqliteTable("server_setting", {
  id: int("id").notNull().primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type"),
});

export {
  userTable,
  sessionTable,
  usersRelations,
  linkTable,
  linksRelations,
  serverSettingTable,
};
