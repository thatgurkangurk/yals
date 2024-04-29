import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "../src/lib/db";
import { startServer } from "./lib/server";
import { env } from "../src/env";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

async function setupDataDir() {
   if (existsSync(env.DATA_DIR)) {
     console.log(`data dir is ${env.DATA_DIR}`);
     return;
   }
   console.log("creating data directory at " + env.DATA_DIR);
   await mkdir(env.DATA_DIR, { recursive: true });
}

try {
  await setupDataDir();
  migrate(db, { migrationsFolder: "./drizzle" });
} catch (err) {
  console.error(err);
  process.exit(1);
}

startServer();

process.on("SIGTERM", () => {
  process.exit(0);
});
