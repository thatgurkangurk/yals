import { drizzle } from "drizzle-orm/better-sqlite3";
import sqlite from "better-sqlite3";
import * as schema from "./schema";

const sqliteDB = sqlite("./data/yals.db");
const db = drizzle(sqliteDB, { schema });

export { db };
