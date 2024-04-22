import { box } from "@/lib/log";
import { get, initialiseConfig } from "@/lib/config";
import { auth } from "./routes/auth";
import { trimTrailingSlash } from "hono/trailing-slash";
import type { AppContext } from "./context";
import { authMiddleware } from "./lib/auth/middleware";
import { cors } from "hono/cors";
import { initialiseDB } from "./lib/db";
import { initialiseLucia } from "./lib/auth/lucia";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono<AppContext>();

app
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "0.4.0",
      title: "yals api",
    },
  })
  .use((c, next) => {
    const handler = cors();
    return handler(c, next);
  })
  .use((c, next) => {
    initialiseDB(c);
    initialiseLucia(c);
    return next();
  })
  .use("*", authMiddleware)
  .use(trimTrailingSlash())
  .route("/api/auth", auth)
  .get("/", (c) => c.text("yals"))
  .get("/healthcheck", (c) => c.text("OK"))
  .get("/api/swagger", swaggerUI({ url: "/doc", version: "2.0" }));

await initialiseConfig();

const port = await get("port");

export default {
  port: port,
  fetch: app.fetch,
};
box(`yals
version 0.4.0
listening on port: ${port}`);
