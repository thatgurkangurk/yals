import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { env } from "../../env";
import * as userSchema from "./schema/user";
import * as sessionSchema from "./schema/session";
import * as linkSchema from "./schema/link";

const schema = {
  ...userSchema,
  ...sessionSchema,
  ...linkSchema,
};

const sqlite = new Database(`${env.DATA_DIR}/yals.db`, {
  readonly: false,
});
const db = drizzle(sqlite, { schema: schema });

export { db, sqlite };
