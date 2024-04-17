import { getLinkBySlug } from "@/lib/link/links";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const shortLink = await getLinkBySlug(slug);

  if (typeof shortLink === "undefined")
    return NextResponse.json(
      {
        message: "no link found",
      },
      {
        status: 404,
      }
    );

  return NextResponse.json({
    redirectsTo: shortLink.target,
  });
}
