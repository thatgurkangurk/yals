import { getLinkBySlug } from "@/lib/link/links";
import { permanentRedirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const shortLink = await getLinkBySlug(slug);

  if (!shortLink) NextResponse.next();

  return permanentRedirect(shortLink.target);
}
