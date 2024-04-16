import { consola } from "consola";
import { env } from "./lib/env";
import { Elysia } from "elysia";
import { db } from "./lib/db";

consola.start("starting yals...");

const app = new Elysia()
    .onStart(() => consola.success("running on port 3000"))
    .get("/", () => "yals")
    .get("/healthcheck", () => "OK")
    .listen(env.PORT);

console.log(db);