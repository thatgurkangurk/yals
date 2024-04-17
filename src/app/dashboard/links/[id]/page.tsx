import { Button } from "@/components/ui/button";
import { deleteLinkAction } from "@/lib/link/actions";
import { getLinkById, getLinkClickCount } from "@/lib/link/links";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LinkDetails({
  params,
}: {
  params: { id: string };
}) {
  const link = await getLinkById(params.id);
  const linkClicks = await getLinkClickCount(link.id);

  if (!link) redirect("/dashboard");

  return (
    <>
      <Button className="w-fit">
        <Link href={"/dashboard"}>back to dashboard</Link>
      </Button>
      <h2 className="text-4xl">link: {link.slug}</h2>
      <p>this page is under construction, clicks: {linkClicks}</p>

      <form action={deleteLinkAction}>
        <input type="hidden" name="id" value={link.id} />

        <Button type="submit" variant={"destructive"}>
          Delete
        </Button>
      </form>
    </>
  );
}
