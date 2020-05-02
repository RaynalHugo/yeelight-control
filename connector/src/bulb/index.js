import { isNil } from "lodash/fp";

import { connectToBulb } from "./connect";
import { commandBulb } from "./command";

export class Bulb {
  constructor(id, address, port = 55443) {
    this.id = id;
    this.address = address;
    this.port = port;
    this.getSocket = async function() {
      if (isNil(this.socket)) {
        const socket = await connectToBulb(this)();
        this.socket = socket;
        return socket;
      } else {
        return this.socket;
      }
    };

    this.command = () =>
      throw new Error("You must call the init function first");
  }

  async init() {
    await this.getSocket();
    this.command = commandBulb.bind(this);
  }
}
