import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getLinkById, getLinkClicks } from "$lib/links";
import { db } from "$lib/db/index";
import { linkClicks, links } from "$lib/db/schema/link";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) return redirect(302, "/");
  if (!params.id) return redirect(302, "/");

  const link = await getLinkById(params.id);
  if (!link) return redirect(302, "/");
  const linkClicks = await getLinkClicks(link.id);

  if (locals.user.id !== link.userId) return redirect(302, "/");

  return {
    link: {
      clicks: linkClicks!.length,
      ...link,
    },
  };
};

export const actions = {
  delete: async ({ params, locals }) => {
    if (!locals.user)
      return {
        error: "you are not signed in",
      };
    if (!params.id)
      return {
        error: "no link id was provided",
      };

    const link = await getLinkById(params.id);
    if (!link)
      return {
        error: "no link was found",
      };
    if (locals.user.id !== link.userId)
      return {
        error: "you do not have permission to delete this link",
      };

    const id = link.id;

    try {
      await db.delete(linkClicks).where(eq(linkClicks.linkId, id));
      await db.delete(links).where(eq(links.id, id));
    } catch (e) {
      return {
        error: "something went wrong",
      };
    } finally {
      return redirect(302, "/dashboard/links");
    }
  },
};
