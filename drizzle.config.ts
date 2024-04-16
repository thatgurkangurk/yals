import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

let DB_URL: string;

if (env.DATA_DIR) DB_URL = `${env.DATA_DIR}/yals.db`;
else DB_URL = "./data/yals.db";

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: DB_URL,
  },
  verbose: true,
});
