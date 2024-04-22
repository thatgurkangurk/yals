import { startServer } from "./lib/server";

startServer();

process.on("SIGTERM", () => {
  process.exit(0);
});
