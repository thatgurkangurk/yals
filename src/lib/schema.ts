import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

const linkClickTable = sqliteTable("link_click", {
  id: text("id").notNull().primaryKey(),
  linkId: text("link_id").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

const linksRelations = relations(linkTable, ({ one, many }) => ({
  owner: one(userTable, {
    fields: [linkTable.userId],
    references: [userTable.id],
  }),
  clicks: many(linkClickTable),
}));

const linkClickRelations = relations(linkClickTable, ({ one }) => ({
  link: one(linkTable, {
    fields: [linkClickTable.linkId],
    references: [linkTable.id],
  }),
}));

const serverSettingsTable = sqliteTable("server_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  registrationEnabled: integer("registration_enabled", {
    mode: "boolean",
  })
    .default(true)
    .notNull(),
  footerEnabled: integer("footer_enabled", {
    mode: "boolean",
  })
    .default(true)
    .notNull(),
});

export {
  userTable,
  sessionTable,
  usersRelations,
  linkTable,
  linksRelations,
  serverSettingsTable,
  linkClickTable,
  linkClickRelations,
};
