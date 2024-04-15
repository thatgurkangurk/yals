import { env } from "@/env";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DB_URL,
  },
  verbose: true,
});
