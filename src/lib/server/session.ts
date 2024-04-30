import type { User, Cookie, Session } from "lucia";
import { lucia } from "./auth";
import type { RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/db";
import { sessions } from "$lib/db/schema/session";
import { eq } from "drizzle-orm";

async function _createSession(userOrUserId: User | string): Promise<Session> {
  if (typeof userOrUserId === "string") {
    const session = await lucia.createSession(userOrUserId, {});
    return session;
  } else {
    const session = await lucia.createSession(userOrUserId.id, {});
    return session;
  }
}

async function createSessionCookie(user: User): Promise<Cookie>;
async function createSessionCookie(userId: string): Promise<Cookie>;
async function createSessionCookie(
  userOrUserId: User | string
): Promise<Cookie> {
  const session = await _createSession(userOrUserId);
  const sessionCookie = lucia.createSessionCookie(session.id);
  return sessionCookie;
}

async function invalidateSession(session: Session, event: RequestEvent) {
  try {
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
    await db.delete(sessions).where(eq(sessions.id, session.id));
  } catch (e) {
    console.log(e);
  }
}

export { createSessionCookie, invalidateSession };
