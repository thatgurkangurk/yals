import type { AppContext } from "@/context";
import type { Context, Next } from "hono";
import { verifyRequestOrigin, type User } from "lucia";
import type { DatabaseUserAttributes } from "./lucia";
import { getCookie } from "hono/cookie";

export async function authMiddleware(c: Context<AppContext>, next: Next) {
  const lucia = c.get("lucia");

  if (c.req.method !== "GET") {
    const originHeader = c.req.header("Origin");
    const hostHeader = c.req.header("Host") ?? c.req.header("X-Forwarded-Host");
    if (
      (!originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])) &&
      c.env.NODE_ENV === "production"
    ) {
      return new Response(null, {
        status: 403,
      });
    }
  }

  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    // use `header()` instead of `setCookie()` to avoid TS errors
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("user", user as User & DatabaseUserAttributes);
  c.set("session", session);
  await next();
}
