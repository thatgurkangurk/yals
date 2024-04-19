import { env } from "./src/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/schema/*",
  driver: "better-sqlite",
  dbCredentials: {
    url: `${env.DATA_DIR}/yals.db`,
  },
  out: "./drizzle",
});
