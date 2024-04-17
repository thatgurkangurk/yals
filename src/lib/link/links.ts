import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db";
import { linkClickTable, linkTable } from "../schema";
import { revalidatePath } from "next/cache";

export async function getAllLinks(ownedBy: string) {
  const links = await db
    .select()
    .from(linkTable)
    .where(eq(linkTable.userId, ownedBy));

  return links;
}

export async function getLinkById(id: string) {
  const link = await db
    .select()
    .from(linkTable)
    .where(eq(linkTable.id, id))
    .limit(1);

  return link[0];
}

export async function getLinkBySlug(slug: string) {
  const link = await db
    .select()
    .from(linkTable)
    .where(eq(linkTable.slug, slug))
    .limit(1);

  return link[0];
}

export async function createLink(
  slug: string,
  target: string,
  ownerId: string
) {
  const id = nanoid();
  const createdLink = await db.insert(linkTable).values({
    id: id,
    slug: slug,
    target: target,
    userId: ownerId,
  });

  return {
    id: id,
    slug: slug,
    target: target,
  };
}

export async function deleteLink(
  id: string
): Promise<{ status: "ok" | "error" }> {
  try {
    await db.delete(linkTable).where(eq(linkTable.id, id));

    return {
      status: "ok",
    };
  } catch (e) {
    return {
      status: "error",
    };
  }
}

export async function logLinkClick(slug: string) {
  const link = await getLinkBySlug(slug);

  const linkClick = await db.insert(linkClickTable).values({
    linkId: link.id
  }).returning();

  revalidatePath(`/dashboard/${link.id}`);
}

export async function getLinkClickCount(linkId: string) {
  const link = await getLinkById(linkId);

  if (!link) return 0;

  const clicksCount = await db.query.linkClickTable.findMany({
    where: (click, { eq }) => eq(click.linkId, link.id)
  });

  return clicksCount.length;
}