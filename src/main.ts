import { Hono } from "hono";
import { box } from "@/lib/log";
import { setupConfigFile, setupDataDir } from "./lib/config";

const app = new Hono();
app.get("/", (c) => c.text("yals"));
app.get("/healthcheck", (c) => c.text("OK"));

await setupDataDir();
const config = await setupConfigFile();

export default {
    port: config.global.port,
    fetch: app.fetch
}
box(`yals
version 0.4.0
listening on port ${config.global.port}`);