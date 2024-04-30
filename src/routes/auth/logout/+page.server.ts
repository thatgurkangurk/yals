import { redirect } from "@sveltejs/kit";
import { fail } from "sveltekit-superforms";
import type { Actions } from "./$types";
import { invalidateSession } from "$lib/server/session";

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    await invalidateSession(event.locals.session, event);

    redirect(302, "/auth/login");
  },
};
