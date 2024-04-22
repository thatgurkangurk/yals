import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});
