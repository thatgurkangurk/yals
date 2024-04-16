import { db } from "./db";
import { serverSettingsTable } from "./schema";

export async function getServerSettingsOrInit() {
  const serverSettings = await db.query.serverSettingsTable.findFirst();

  if (!serverSettings) {
    await db.insert(serverSettingsTable).values({}).execute();
    const newServerSettings = await db.query.serverSettingsTable.findFirst();

    return newServerSettings!;
  }

  return serverSettings;
}
