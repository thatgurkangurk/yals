import type { Config } from "drizzle-kit";

export default {
    schema: "./src/lib/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: `${process.env.DATA_DIR || "./data"}/yals.db`
    },
    verbose: true

} satisfies Config;