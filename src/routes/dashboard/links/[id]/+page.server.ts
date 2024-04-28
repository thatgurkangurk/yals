import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getLinkById, getLinkClicks } from "$lib/links";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) return redirect(302, "/");
  if (!params.id) return redirect(302, "/");

  const link = await getLinkById(params.id);
  const linkClicks = await getLinkClicks(link.id);

  return {
    link: {
      clicks: linkClicks!.length,
      ...link,
    },
  };
};
