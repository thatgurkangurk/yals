import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

const userRole = text("role", { enum: ["admin", "user"] })
  .notNull()
  .default("user");

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(21))
    .unique(),
  username: text("username").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
  role: userRole,
});
