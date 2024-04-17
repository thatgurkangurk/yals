import { Button } from "@/components/ui/button";
import { deleteLinkAction } from "@/lib/link/actions";
import { getLinkById, getLinkClicks } from "@/lib/link/links";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function LinkStatistics({ linkId }: { linkId: string }) {
  const linkClicks = await getLinkClicks(linkId);

  if (!linkClicks || linkClicks.length === 0)
    return (
      <div className="py-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No statistics yet.</AlertTitle>
          <AlertDescription>
            No one has used your link yet. When they do, you will be able to see
            it here.
          </AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="py-4">
      <h3 className="text-xl font-bold">link statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Link Clicks (lifetime)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkClicks?.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function LinkDetails({
  params,
}: {
  params: { id: string };
}) {
  const link = await getLinkById(params.id);

  if (!link) redirect("/dashboard");

  return (
    <>
      <Button className="w-fit">
        <Link href={"/dashboard"}>back to dashboard</Link>
      </Button>
      <h2 className="text-4xl">link: {link.slug}</h2>
      <LinkStatistics linkId={link.id} />

      <form action={deleteLinkAction}>
        <input type="hidden" name="id" value={link.id} />

        <Button type="submit" variant={"destructive"}>
          Delete
        </Button>
      </form>
    </>
  );
}
