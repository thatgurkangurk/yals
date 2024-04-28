import { getMigrations, migrate } from "bun-sqlite-migrations";
import { sqlite } from "../src/lib/db";
import { startServer } from "./lib/server";

try {
  migrate(sqlite, getMigrations("./drizzle"));
} catch (err) {
  console.error(err);
  process.exit(1);
}

startServer();

process.on("SIGTERM", () => {
  process.exit(0);
});
