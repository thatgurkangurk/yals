import { Hono } from "hono";
import { box } from "@/lib/log";

const app = new Hono();
app.get("/", (c) => c.text("yals"));
app.get("/healthcheck", (c) => c.text("OK"));

box("yals hono rewrite");

export default {
    port: 3000,
    fetch: app.fetch
}