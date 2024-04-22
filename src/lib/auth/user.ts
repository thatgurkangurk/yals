import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "@/lib/schema/user";
import { hashPassword } from "./password";
import { lucia } from "./lucia";

export async function userExists(username: string) {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (user) return true;
  return false;
}

export async function getUser(username: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user[0];
}

export async function getTotalUserCount() {
  const count = await db.select({ count: sql<number>`count(*)` }).from(users);
  return count[0].count;
}

export async function isUsersEmpty() {
  const count = await getTotalUserCount();
  const isEmpty = count === 0;

  return isEmpty;
}

export async function createUser(username: string, password: string) {
  const isEmpty = await isUsersEmpty();
  const hashedPassword = await hashPassword(password);

  return (
    await db
      .insert(users)
      .values({
        username: username,
        hashed_password: hashedPassword,
        role: isEmpty ? "admin" : "user",
      })
      .returning({
        id: users.id,
        username: users.username,
        role: users.role,
      })
  )[0];
}

export async function createSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return sessionCookie;
}
