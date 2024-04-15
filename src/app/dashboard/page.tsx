import { getUser } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { getAllLinks } from "@/lib/link/links";
import { redirect } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function LinkCard({
  link,
}: {
  link: {
    id: string;
    slug: string;
    target: string;
  };
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{link.id}</CardDescription>
        <CardTitle className="text-4xl">{link.slug}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button>
          <Link href={`/dashboard/links/${link.id}`}>manage</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function Dashboard() {
  const { user } = await getUser();

  const links = await getAllLinks(user!.id);

  return (
    <>
      <h1 className="text-4xl md:text-5xl">
        welcome to yals, {user!.username}
      </h1>

      <Button className="w-fit">
        <Link href={"/dashboard/links/create"}>create link</Link>
      </Button>

      <div className="pt-4 grid md:grid-cols-2 gap-2">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </>
  );
}
