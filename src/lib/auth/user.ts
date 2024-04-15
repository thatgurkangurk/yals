import { db } from "../db";
import { userTable } from "../schema";
import { sql } from "drizzle-orm";

export async function userExists(username: string) {
  const user = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (user) return true;
  return false;
}

export async function getTotalUserCount() {
    const count = await db.select({ count: sql<number>`count(*)` }).from(userTable);
    return count[0].count;
}

export async function isUsersEmpty() {
    const count = await getTotalUserCount();
    const isEmpty = count === 0;
}