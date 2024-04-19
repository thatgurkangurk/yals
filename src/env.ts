import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATA_DIR: z.string().nullish().transform((s) => s ?? "./data"),
        NODE_ENV: z.enum([ "production", "development", "test" ]).nullish().transform((s) => s ?? "development")
    },
    runtimeEnv: Bun.env
})