import type { User } from "lucia";
import { db } from "./db";
import { linkClicks, links } from "./db/schema/link";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export function extractSlug(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

async function getLinksWithAccess(user: User) {
  return await db.select().from(links).where(eq(links.userId, user.id));
}

async function getLinkById(id: string) {
  const link = await db.select().from(links).where(eq(links.id, id)).limit(1);

  return link[0];
}

async function getLinkBySlug(slug: string) {
  const link = await db
    .select()
    .from(links)
    .where(eq(links.slug, extractSlug(slug)))
    .limit(1);

  return link[0];
}

async function createLink(slug: string, target: string, owner: User) {
  const id = nanoid();
  const createdLink = await db
    .insert(links)
    .values({
      id: id,
      slug: slug,
      target: target,
      userId: owner.id,
    })
    .returning();

  return createdLink[0];
}

async function logLinkClick(slug: string) {
  const link = await getLinkBySlug(slug);

  console.log("logging link click");

  const linkClick = await db
    .insert(linkClicks)
    .values({
      id: nanoid(),
      linkId: link.id,
    })
    .returning();
}

async function getLinkClicks(linkId: string) {
  const link = await getLinkById(linkId);

  if (!link) return null;

  const clicks = await db.query.linkClicks.findMany({
    where: (click, { eq }) => eq(click.linkId, link.id),
  });

  return clicks;
}

export {
  logLinkClick,
  getLinksWithAccess,
  getLinkById,
  getLinkBySlug,
  createLink,
  getLinkClicks,
};
