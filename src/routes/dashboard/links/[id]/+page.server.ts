import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getLinkById } from "$lib/links";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) return redirect(302, "/");
  if (!params.id) return redirect(302, "/");

  const link = await getLinkById(params.id);

  return {
    link: link,
  };
};
