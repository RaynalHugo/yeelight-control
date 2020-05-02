import { get, join, map, isString } from "lodash/fp";

export async function command(socket, { id, method, params }) {
  console.log(
    "sending command " +
      `{"id": ${id}, "method": "${method}", "params": [${params}]}\r\n`
  );

  const stringifiedParams = join(
    ", ",
    map((param) => (isString(param) ? `"${param}"` : param), params)
  );

  const result = await socket.write(
    // '{"id": 0x0000000007D02FCC,"method": "toggle","params": []}\r\n'
    `{"id": ${id},"method": "${method}", "params": [${stringifiedParams}]}\r\n`,
    "utf8",
    (...args) => console.log("callback", ...args)
  );

  return result;
}

export async function commandBulb({ method, params }) {
  const socket = this.socket;
  const id = this.id;
  return command(socket, { id, method, params });
}
