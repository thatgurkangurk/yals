import { Hono } from "hono";
import { box } from "@/lib/log";
import { get, initialiseConfig } from "@/lib/config";

const app = new Hono();
app.get("/", (c) => c.text("yals"));
app.get("/healthcheck", (c) => c.text("OK"));

await initialiseConfig();

const port = await get("port");

export default {
  port: port,
  fetch: app.fetch,
};
box(`yals
version 0.4.0
listening on port: ${port}`);
