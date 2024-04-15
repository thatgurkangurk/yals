import { drizzle } from "drizzle-orm/better-sqlite3";
import sqlite from "better-sqlite3";
import * as schema from "./schema";
import { env } from "@/env";

const sqliteDB = new sqlite(env.DB_URL, {
  fileMustExist: false,
});
const db = drizzle(sqliteDB, { schema });

export { db };
