import { Button } from "@/components/ui/button";
import { getLinkBySlug } from "@/lib/link/links";
import Link from "next/link";

export default async function SearchPage({
  params,
}: {
  params: { slug: string };
}) {
  const link = await getLinkBySlug(params.slug);

  if (typeof link === "undefined") return <p>link was not found</p>;

  return (
    <div>
      <p>
        the link with the slug <code>/{params.slug}</code> redirects to:{" "}
        <Link href={link.target}>
          <Button variant={"link"} className="p-0">
            {link.target}
          </Button>
        </Link>
      </p>
    </div>
  );
}
