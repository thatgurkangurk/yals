import { z } from "zod";
import { consola } from "consola";

const envSchema = z.object({
    DATA_DIR: z.string().default("./data"),
    PORT: z.number().default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development")
});

const envServer = envSchema.safeParse({
    DATA_DIR: Bun.env.DATA_DIR,
    PORT: Bun.env.PORT,
    NODE_ENV: Bun.env.NODE_ENV
});

if (!envServer.success) {
    consola.error(envServer.error.issues);
    throw new Error("there was an error with the server environment variables");
    process.exit(1);
}

export const env = envServer.data;