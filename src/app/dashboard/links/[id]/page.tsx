import { Button } from "@/components/ui/button";
import { deleteLinkAction } from "@/lib/link/actions";
import { getLinkById, getLinkClicks } from "@/lib/link/links";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LinkDetails({
  params,
}: {
  params: { id: string };
}) {
  const link = await getLinkById(params.id);

  if (!link) redirect("/dashboard");

  const linkClicks = await getLinkClicks(link.id);

  return (
    <>
      <Button className="w-fit">
        <Link href={"/dashboard"}>back to dashboard</Link>
      </Button>
      <h2 className="text-4xl">link: {link.slug}</h2>
      <p>this page is under construction, clicks: {linkClicks?.length}</p>

      <form action={deleteLinkAction}>
        <input type="hidden" name="id" value={link.id} />

        <Button type="submit" variant={"destructive"}>
          Delete
        </Button>
      </form>
    </>
  );
}
