import { db } from "./db";
import { serverSettings as serverSettingsTable } from "./db/schema/serverSettings";

export async function getServerSettingsOrInit() {
  const serverSettings = await db.query.serverSettings.findFirst();

  if (!serverSettings) {
    const newSettings = await db
      .insert(serverSettingsTable)
      .values({})
      .returning();

    return newSettings![0];
  }

  return serverSettings;
}
