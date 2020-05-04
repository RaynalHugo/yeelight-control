import net from "net";
import { isEqual } from "lodash/fp";
import { Subject, fromEvent } from "rxjs";
import { tap, filter, pluck } from "rxjs/operators";

const BULB_PORT = 55443;
const HOST = "192.168.0.16";

export const write$ = new Subject();

write$.subscribe({
  next: () =>
    console.log(
      `${new Date(Date.now()).toISOString()} - Received a new write function`
    ),
});

export const connectToBulb = async () => {
  const client = new net.Socket();

  fromEvent(client, "error")
    .pipe(
      pluck("code"),
      tap((errorCode) =>
        console.log(
          `${new Date(Date.now()).toISOString()} - Caught error: `,
          errorCode
        )
      ),
      filter(isEqual("ECONNRESET"))
    )
    .subscribe(() => {
      client.destroy();
      connectToBulb();
    });

  fromEvent(client, "data").subscribe((buffer) => {
    const data = buffer.toString();

    console.log(
      `${new Date(Date.now()).toISOString()} - Received: `,
      data.substring(0, data.length - 2)
    );
  });

  await client.connect(BULB_PORT, HOST, function() {
    console.log(
      `${new Date(
        Date.now()
      ).toISOString()} - Connected to: ${HOST}:${BULB_PORT}`
    );
    write$.next((message) => client.write(message, "utf8"));
  });
};
