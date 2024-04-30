import { getServerSettingsOrInit } from "$lib/serverSettings";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const settings = await getServerSettingsOrInit();
  return {
    user: event.locals.user,
    session: event.locals.session,
    settings: settings
  };
};
