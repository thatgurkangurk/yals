import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text("yals"));
app.get("/healthcheck", (c) => c.text("OK"));

export default {
    port: 3000,
    fetch: app.fetch
}