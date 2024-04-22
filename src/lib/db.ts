import { env } from "@/env";
import { Database as BunDatabase } from "bun:sqlite";
import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as userSchema from "./schema/user";
import * as sessionSchema from "./schema/session";
import type { Context } from "hono";
import type { AppContext } from "@/context";

const schema = { ...userSchema, ...sessionSchema };
const sqlite = new BunDatabase(`${env.DATA_DIR}/yals.db`, {
  create: true,
});
export const db = drizzle(sqlite, { schema: schema });

export function initialiseDB(c: Context<AppContext>) {
  c.set("db", db);
}

export type Database = BunSQLiteDatabase<typeof schema>;
