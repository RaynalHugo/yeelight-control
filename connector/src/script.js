const PORT = 55443;
const HOST = "192.168.0.16";
// const HOST = "239.255.255.250";

import { Bulb } from "./bulb";

const dgram = require("dgram");
const net = require("net");
const message = `M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1982\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n`;

import { get, floor } from "lodash/fp";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  const appoint = new Bulb(0x0000000007d02fcc, HOST, PORT);
  console.log(appoint);
  console.log(appoint.id);

  console.log(await appoint.init());

  await appoint.command({ method: "set_rgb", params: [0xffffff, "sudden", 0] });
  await appoint.command({ method: "toggle", params: [] });

  await delay(200);
  await appoint.command({ method: "toggle", params: [] });
  await delay(200);
  await appoint.command({ method: "toggle", params: [] });
  await delay(200);
  await appoint.command({ method: "toggle", params: [] });

  while (false) {
    await appoint.command({
      method: "set_rgb",
      params: [0x0000ff, "smooth", 500],
    });
    await appoint.command({
      method: "set_bright",
      params: [floor(Math.random() * 100), "smooth", 500],
    });
    await delay(2000);
    await appoint.command({
      method: "set_rgb",
      params: [0xffffff, "sudden", 500],
    });
    await appoint.command({
      method: "set_bright",
      params: [floor(Math.random() * 100), "smooth", 500],
    });
    await delay(2000);
    await appoint.command({
      method: "set_rgb",
      params: [0xff0000, "smooth", 500],
    });
    await appoint.command({
      method: "set_bright",
      params: [floor(Math.random() * 100), "smooth", 500],
    });
    await delay(2000);
  }
}

main();
