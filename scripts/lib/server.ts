/*
this is basically just the svelte-adapter-bun script pasted in here but with sigterm exit added
MIT © Volodymyr Palamar https://github.com/gornostay25/svelte-adapter-bun
*/
import { build_options, env, handler_default } from "../../build/handler";
import "../../build/mime.conf";

const { serve } = globalThis.Bun;
const hostname = env("HOST", "0.0.0.0");
const port = parseInt(env("PORT", 3000));
const { httpserver, websocket } = handler_default(build_options.assets ?? true);
const serverOptions = {
  baseURI: env("ORIGIN", undefined),
  fetch: httpserver,
  hostname,
  port,
  development: env("SERVERDEV", build_options.development ?? false),
  error(error) {
    console.error(error);
    return new Response("Uh oh!!", { status: 500 });
  },
  websocket,
};
websocket && (serverOptions.websocket! = websocket);
console.info(
  `Listening on ${hostname + ":" + port}` + (websocket ? " (Websocket)" : "")
);

export function startServer() {
  serve(serverOptions);
}
