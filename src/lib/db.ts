import { env } from "@/env";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(`${env.DATA_DIR}/yals.db`, { create: true });
const db = drizzle(sqlite);

export { db };
