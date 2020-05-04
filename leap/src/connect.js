import net from "net";
import { isEqual } from "lodash/fp";
import { Subject, fromEvent } from "rxjs";
import { tap, filter, pluck } from "rxjs/operators";

import { log } from "./logger";

const BULB_PORT = 55443;
const HOST = "192.168.0.16";

export const write$ = new Subject();

write$.subscribe({
  next: () => log(`Received a new write function`),
});

export const connectToBulb = async () => {
  const client = new net.Socket();

  fromEvent(client, "error")
    .pipe(
      pluck("code"),
      tap((errorCode) => log(`Caught error: ${errorCode}`)),
      filter(isEqual("ECONNRESET"))
    )
    .subscribe(() => {
      client.destroy();
      connectToBulb();
    });

  fromEvent(client, "data").subscribe((buffer) => {
    const data = buffer.toString();
    log(`Received: ${data.substring(0, data.length - 2)}`);
  });

  await client.connect(BULB_PORT, HOST, function() {
    log(`Connected to: ${HOST}:${BULB_PORT}`);
    write$.next((message) => client.write(message, "utf8"));
  });
};
