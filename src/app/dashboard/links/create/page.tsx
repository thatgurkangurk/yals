import { CreateLinkForm } from "@/components/link-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateLink() {
  return (
    <>
      <Button className="w-fit">
        <Link href={"/dashboard"}>back to dashboard</Link>
      </Button>

      <CreateLinkForm />
    </>
  );
}
