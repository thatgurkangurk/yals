import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { startServer } from "./lib/server";
import { env } from "../src/env";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { Database } from "bun:sqlite";
import * as userSchema from "../src/lib/db/schema/user";
import * as sessionSchema from "../src/lib/db/schema/session";
import * as linkSchema from "../src/lib/db/schema/link";

const schema = {
  ...userSchema,
  ...sessionSchema,
  ...linkSchema,
};

async function setupDataDir() {
   if (existsSync(env.DATA_DIR)) {
     console.log(`data dir is ${env.DATA_DIR}`);
     return;
   }
   console.log("creating data directory at " + env.DATA_DIR);
   await mkdir(env.DATA_DIR, { recursive: true });
}

async function migrateDB() {
  const sqlite = new Database(`${env.DATA_DIR}/yals.db`, { create: true });
  const db = drizzle(sqlite, { schema: schema });
  migrate(db, { migrationsFolder: "./drizzle" });
}

try {
  await setupDataDir();
  await migrateDB();
} catch (err) {
  console.error(err);
  process.exit(1);
}

startServer();

process.on("SIGTERM", () => {
  process.exit(0);
});
