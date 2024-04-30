import type { User, Cookie, Session } from "lucia";
import { lucia } from "./auth";

async function _createSession(userOrUserId: User | string): Promise<Session> {
  if (typeof userOrUserId === 'string') {
    const session = await lucia.createSession(userOrUserId, {});
    return session;
  } else {
    const session = await lucia.createSession(userOrUserId.id, {});
    return session;
  }
}

async function createSessionCookie(user: User): Promise<Cookie>;
async function createSessionCookie(userId: string): Promise<Cookie>;
async function createSessionCookie(userOrUserId: User | string): Promise<Cookie> {
    const session = await _createSession(userOrUserId);
    const sessionCookie = lucia.createSessionCookie(session.id);
    return sessionCookie;
}

export {
    createSessionCookie
}

