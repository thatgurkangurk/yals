import { consola } from "consola";

function info(message: string) {
  consola.info(message);
}

function log(message: string) {
  consola.log(message);
}

function warn(message: string) {
  consola.warn(message);
}

function error(message: string) {
  consola.error(message);
}

function start(message: string) {
  consola.start(message);
}

function box(message: string) {
  consola.box(message);
}

function success(message: string) {
  consola.success(message);
}

export { info, log, warn, start, error, box, success };
