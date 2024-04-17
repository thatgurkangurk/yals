import { db } from "./db";
import { serverSettingsTable } from "./schema";

export async function getServerSettingsOrInit() {
  const serverSettings = await db.query.serverSettingsTable.findFirst();

  if (!serverSettings) {
    const newSettings = await db
      .insert(serverSettingsTable)
      .values({})
      .returning();

    return newSettings[0]!;
  }

  return serverSettings;
}
