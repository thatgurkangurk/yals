import { sqliteTable, integer } from "drizzle-orm/sqlite-core";

const serverSettings = sqliteTable("server_settings", {
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

export { serverSettings };
