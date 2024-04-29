// @ts-check
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { env } from "../src/env";

const betterSqlite = new Database(`${env.DATA_DIR}/yals.db`);
const db = drizzle(betterSqlite);
migrate(db, { migrationsFolder: "drizzle" });

betterSqlite.close();
