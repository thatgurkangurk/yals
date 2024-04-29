import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { db } from "$lib/db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions } from "$lib/db/schema/session";
import { users } from "$lib/db/schema/user";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      role: attributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  role: "admin" | "user";
}
