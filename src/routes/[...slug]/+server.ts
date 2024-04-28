import { extractSlug, getLinkBySlug, logLinkClick } from "$lib/links.js";
import { error, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */
export async function GET({ request, url }) {
  const slug = extractSlug(url.pathname);
  const purpose = request.headers.get("Sec-Purpose");
  const link = await getLinkBySlug(slug);

  if (purpose?.includes("prefetch")) {
    redirect(307, link.target);
  }

  if (typeof link === "undefined") {
    error(404, "that short link does not exist.");
  }

  logLinkClick(link.slug);

  redirect(307, link.target);
}
