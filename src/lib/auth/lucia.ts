import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions } from "../schema/session";
import { users } from "../schema/user";
import { Lucia } from "lucia";
import type { AppContext } from "@/context";
import type { Context } from "hono";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "../db";
import { env } from "@/env";

const adapter = new DrizzleSQLiteAdapter(db as never, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: env.NODE_ENV !== "development",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      role: attributes.role,
    };
  },
});

export function initialiseLucia(c: Context<AppContext>) {
  c.set("lucia", lucia);
  return lucia;
}

export type DatabaseUserAttributes = Omit<
  InferInsertModel<typeof users>,
  "hashed_password"
>;
