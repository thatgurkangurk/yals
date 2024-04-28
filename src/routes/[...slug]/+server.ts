import { extractSlug, getLinkBySlug } from "$lib/links.js";
import { error, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const slug = extractSlug(url.pathname);
  const link = await getLinkBySlug(slug);

  if (typeof link === "undefined") {
    error(404, "that short link does not exist.");
  }

  redirect(307, link.target);
}
