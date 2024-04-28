import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "../src/lib/db";
import ora from "ora";

const spinner = ora("migrating the database...");

debugger;
spinner.start();
try {
  migrate(db, { migrationsFolder: "./drizzle" });
} catch (e) {
  spinner.text = "something went wrong...";
  spinner.fail();
  console.error(e as string);
  process.exit(1);
} finally {
  spinner.text = "migrated!";
  spinner.succeed();

  process.exit(0);
}
