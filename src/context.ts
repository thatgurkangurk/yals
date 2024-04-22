import type { User, Session, Lucia } from "lucia";
import type { Database } from "./lib/db";
import type { DatabaseUserAttributes, initialiseLucia } from "./lib/auth/lucia";
import type { env } from "./env";

type Variables = {
  db: Database;
  user: (User & DatabaseUserAttributes) | null;
  session: Session | null;
  lucia: Lucia<DatabaseUserAttributes>;
};

export interface AppContext {
  Variables: Variables;
  Bindings: typeof env;
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initialiseLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
