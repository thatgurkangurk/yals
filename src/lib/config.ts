import { env } from "@/env";
import { exists, mkdir } from "node:fs/promises";
import { error, info } from "./log";
import { z } from "zod";
import { type BunFile } from "bun";
import toml from "smol-toml";

export async function setupDataDir() {
    if (!(await exists(env.DATA_DIR))) {
        // setup the config directory and files
        info("data directory does not exist.");
        try {
            await mkdir(env.DATA_DIR);
        } catch (e) {
            error(e as string);
            process.exit(1);
        }
    }
}

const defaultConfig = `
[global]
registrationEnabled = true
port = 3000
`;

const configSchema = z.object({
    global: z.object({
        registrationEnabled: z.boolean(),
        port: z.number()
    })
});

export type ConfigFile = z.infer<typeof configSchema>;

async function readConfigFile(file: BunFile) {
    const content = await file.text();
    if (!content) {
        await Bun.write(file, defaultConfig);
    }

    return content;
}

export async function parseConfigFile(file: BunFile) {
   const content = await readConfigFile(file);
   const configData = await toml.parse(content);

   const parse = await configSchema.safeParseAsync(configData);

   if (!parse.success) {
    error(`your config file is invalid: ${parse.error.flatten()}`);
    process.exit(1);
   }

   return parse.data;
}

export async function setupConfigFile() {
   const file = Bun.file(`${env.DATA_DIR}/yals.toml`);

   const config = await parseConfigFile(file);
   return config;
}