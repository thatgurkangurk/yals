import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notFound, redirect } from "next/navigation";
import { extractSlug } from "@/lib/utils";
import { zfd } from "zod-form-data";
import { z } from "zod";

const searchFormSchema = zfd.formData({
  url: z.string().min(2),
});

async function SearchForm() {
  async function search(formData: FormData) {
    "use server";

    const parsedData = searchFormSchema.safeParse(formData);

    if (!parsedData.success) return notFound();

    const { url } = parsedData.data;
    const slug = extractSlug(url);

    return redirect(`/search/${slug}`);
  }
  return (
    <form className="pt-4" action={search}>
      <Label htmlFor="url">Link to search</Label>
      <Input placeholder="url" id="url" name="url" required />
      <br />
      <Button type="submit">search</Button>
    </form>
  );
}

export default async function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <h2 className="text-3xl">link searcher</h2>
      {children}
      <SearchForm />
    </>
  );
}
