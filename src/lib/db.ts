import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import sqlite from "better-sqlite3";
import * as schema from "./schema";
import { env } from "@/env";

let DB_URL: string;

if (env.DATA_DIR) DB_URL = `${env.DATA_DIR}/yals.db`;
else DB_URL = "./data/yals.db";

const sqliteDB = new sqlite(DB_URL, {
  fileMustExist: false,
});
const db: BetterSQLite3Database<typeof schema> = drizzle(sqliteDB, { schema });

export { db };
