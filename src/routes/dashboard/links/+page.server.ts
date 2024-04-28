import { getLinksWithAccess } from "$lib/links";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return redirect(302, "/");
  const links = await getLinksWithAccess(event.locals.user);
  return {
    links: links,
  };
};
