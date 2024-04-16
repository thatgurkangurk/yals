import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { env } from "./env";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database(`${env.DATA_DIR}/yals.db`, {
    create: true
});

export const db = drizzle(sqlite, {
    schema: schema
});

await migrate(db, { migrationsFolder: "drizzle" });