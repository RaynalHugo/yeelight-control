import { Subject } from "rxjs";
import net from "net";

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
  client.on("error", (...args) => {
    console.log(
      `${new Date(Date.now()).toISOString()} - Caught error: `,
      ...args
    );
    client.destroy();
    connectToBulb();
  });
  client.on("data", (buffer) => {
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
