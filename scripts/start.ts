import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "../src/lib/db";
import { startServer } from "./lib/server";

try {
  migrate(db, { migrationsFolder: "./drizzle" });
} catch (err) {
  console.error(err);
  process.exit(1);
}

startServer();

process.on("SIGTERM", () => {
  process.exit(0);
});
