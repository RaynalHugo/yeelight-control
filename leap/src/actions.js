import net from "net";
import { Bulb } from "yeelight-connector";
import { log } from "./logger";

const BULB_PORT = 55443;
const HOST = "192.168.0.16";

let globalAppoint;
const setup = async () => {
  const appoint = new Bulb(0x0000000007d02fcc, HOST, BULB_PORT);
  await appoint.init();

  const server = new net.Server();
  server.on("error", (error) => log(`error ${error}`));
  server.on("connection", (socket) => {
    socket.on("error", (error) => log(`error ${error}`));
    // appoint.socket.end();
    // appoint.socket = socket;
    log("Music mode activated");
    globalAppoint = appoint;
  });

  server.listen(54321, "192.168.0.19", () =>
    log("listening on 192.168.0.19:54321")
  );

  // await appoint.command({
  //   method: "set_music",
  //   params: [1, "192.168.0.19", 54321],
  // });

  globalAppoint = appoint;
};

// setup();

import { get, join, map, isString } from "lodash/fp";

export function createCommand({ id, method, params }) {
  const stringifiedParams = join(
    ", ",
    map((param) => (isString(param) ? `"${param}"` : param), params)
  );

  return `{"id": ${id},"method": "${method}", "params": [${stringifiedParams}]}\r\n`;
}

export async function commandBulb({ method, params }) {
  const socket = this.socket;
  const id = this.id;
  return command(socket, { id, method, params });
}

export const setBright = (intensity, effect = "smooth", duration = 500) => (
  id
) =>
  createCommand({
    id,
    method: "set_bright",
    params: [Number(intensity), effect, duration],
  });

export const setOn = (effect = "smooth", duration = 500, mode = 0) => (id) =>
  createCommand({
    id,
    method: "set_power",
    params: ["on", effect, duration, mode],
  });

export const setOff = (effect = "smooth", duration = 500) => (id) =>
  createCommand({ id, method: "set_power", params: ["off", effect, duration] });

export const increaseColorTemperature = (value = 10, duration = 200) => (id) =>
  createCommand({ id, method: "adjust_ct", params: [value, duration] });

export const decreaseColorTemperature = (value = 10, duration = 200) => (id) =>
  createCommand({ id, method: "adjust_ct", params: [-value, duration] });

export const increaseBrightness = (value = 10, duration = 200) => (id) =>
  createCommand({ id, method: "adjust_bright", params: [value, duration] });

export const decreaseBrightness = (value = 10, duration = 200) => (id) =>
  createCommand({ id, method: "adjust_bright", params: [-value, duration] });
