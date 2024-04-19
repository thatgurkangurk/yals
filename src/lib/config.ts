import { env } from "@/env";
import { parse, stringify } from "smol-toml";
import { z } from "zod";
import { error, info } from "./log";

const configSchema = z.object({
  port: z.number().default(3000),
  registrationEnabled: z.boolean().default(true),
  footerEnabled: z.boolean().default(true),
});

const defaultConfig = configSchema.parse({});

type ConfigData = z.infer<typeof configSchema>;
type ConfigKey = keyof ConfigData;

const configFile = Bun.file(`${env.DATA_DIR}/yals.toml`);

async function readConfig(): Promise<ConfigData> {
  const content = await configFile.text();
  const parsedContent = parse(content);
  const config = await configSchema.safeParseAsync(parsedContent);

  if (!config.success) {
    error(
      `something went wrong while reading the config: ${
        config.error.flatten().fieldErrors.registrationEnabled
      }`
    );
    process.exit(1);
  }

  return config.data;
}

async function writeConfig(config: Partial<ConfigData>) {
  const existingConfig = await readConfig();

  const configToWrite: ConfigData = {
    ...existingConfig,
    ...config,
  };

  const stringifiedConfig = stringify(configToWrite);

  await Bun.write(
    configFile,
    `# yals config
# you can find the config reference on github https://github.com/thatgurkangurk/yals
${stringifiedConfig}`
  );
}

async function writeDefaultConfig() {
  await Bun.write(configFile, stringify(defaultConfig));
}

async function addMissingKeys() {
  const existingConfig = await readConfig();
  const newConfig = await configSchema.parseAsync({
    ...existingConfig,
  });

  await writeConfig(newConfig);
}

export async function initialiseConfig() {
  const fileExists = await configFile.exists();

  if (!fileExists) {
    info("config file does not exist. writing default config");
    await writeDefaultConfig();
  }

  await addMissingKeys();
}

export async function get<T extends ConfigKey>(key: T) {
  const config = await readConfig();
  const value = config[key];
  return value;
}

export async function set<T extends ConfigKey>(key: T, value: ConfigData[T]) {
  await writeConfig({
    [key]: value,
  });
}
