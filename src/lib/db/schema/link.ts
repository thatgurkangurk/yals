import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";

const links = sqliteTable("link", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  slug: text("slug").notNull().unique(),
  target: text("target").notNull(),
});

const linkClicks = sqliteTable("link_click", {
  id: text("id").notNull().primaryKey(),
  linkId: text("link_id").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

const linksRelations = relations(links, ({ one, many }) => ({
  owner: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  clicks: many(linkClicks),
}));

const linkClickRelations = relations(linkClicks, ({ one }) => ({
  link: one(links, {
    fields: [linkClicks.linkId],
    references: [links.id],
  }),
}));

export { links, linkClicks, linksRelations, linkClickRelations };
