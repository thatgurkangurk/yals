export const revalidate = 1;
export const dynamic = "force-dynamic";

import { getLinkBySlug, logLinkClick } from "@/lib/link/links";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log("request");
  const { slug } = params;

  const shortLink = await getLinkBySlug(slug);

  if (typeof shortLink === "undefined") return notFound();

  await logLinkClick(shortLink.slug);
  return redirect(shortLink.target);
}
