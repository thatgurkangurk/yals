import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getServerSettingsOrInit } from "$lib/serverSettings";
import { serverSettings } from "$lib/db/schema/serverSettings";
import { db } from "$lib/db";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return redirect(302, "/");
  if (event.locals.user.role !== "admin")
    return redirect(302, "/dashboard/links");

  const settings = await getServerSettingsOrInit();

  return {
    settings,
  };
};

export const actions: Actions = {
  registration: async (event) => {
    if (!event.locals.user || event.locals.user.role !== "admin")
      return fail(403, {
        success: false,
        message: "you do not have permission to do that",
      });

    const settings = await getServerSettingsOrInit();

    await db
      .update(serverSettings)
      .set({
        registrationEnabled: !settings.registrationEnabled,
      })
      .where(eq(serverSettings.id, 1));
  },
};
