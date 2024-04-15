import { generateId } from "lucia";
import { db } from "../db";
import { userTable } from "../schema";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "./password";
import { lucia } from "./config";

type User = {
  id: string;
  username: string;
};

export async function userExists(username: string) {
  const user = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (user) return true;
  return false;
}

export async function getTotalUserCount() {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTable);
  return count[0].count;
}

export async function getUser(username: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username))
    .limit(1);

  return user[0];
}

export async function isUsersEmpty() {
  const count = await getTotalUserCount();
  const isEmpty = count === 0;

  return isEmpty;
}

export async function createUser(
  username: string,
  password: string
): Promise<User> {
  const isEmpty = await isUsersEmpty();
  const hashedPassword = await hashPassword(password);
  const userId = generateId(15);

  if (isEmpty) {
    await db.insert(userTable).values({
      id: userId,
      username: username,
      hashed_password: hashedPassword,
      role: "admin",
    });

    return {
      id: userId,
      username: username,
    };
  }

  await db.insert(userTable).values({
    id: userId,
    username: username,
    hashed_password: hashedPassword,
    role: "user",
  });

  return {
    id: userId,
    username: username,
  };
}

export async function createSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return sessionCookie;
}
