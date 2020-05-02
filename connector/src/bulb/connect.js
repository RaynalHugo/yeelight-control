const net = require("net");
import { get } from "lodash/fp";

export async function connect(address, port, id) {
  const client = new net.Socket();

  client.on("error", (...args) => console.log("error", ...args));
  client.on("data", (buffer) => console.log("data2", buffer.toString()));

  await client.connect(port, address, function() {
    console.log("CONNECTED TO: " + address + ":" + port);
  });

  // await client.write(
  //   `{"id": ${id},"method": "set_music", "params": [1, "192.168.0.19", 54321]]}\r\n`,
  //   "utf8",
  //   (...args) => console.log("callback", ...args)
  // );

  return client;
}

export function connectToBulb(bulb) {
  const address = get("address", bulb);
  const port = get("port", bulb);
  const id = get("id", bulb);

  return async function() {
    return await connect(address, port, id);
  };
}
