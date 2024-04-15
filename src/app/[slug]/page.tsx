import { getLinkBySlug } from "@/lib/link/links";
import { notFound, permanentRedirect } from "next/navigation";

export default async function ShortLinkSlug({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const shortLink = await getLinkBySlug(slug);

  if (!shortLink) notFound();

  return permanentRedirect(shortLink.target);
}
