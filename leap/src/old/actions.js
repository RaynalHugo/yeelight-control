import net from "net";
import { Bulb } from "yeelight-connector";

const BULB_PORT = 55443;
const HOST = "192.168.0.16";

let globalAppoint;
const setup = async () => {
  const appoint = new Bulb(0x0000000007d02fcc, HOST, BULB_PORT);
  await appoint.init();

  const server = new net.Server();
  server.on("error", (error) => console.log("error", error));
  server.on("connection", (socket) => {
    socket.on("error", (error) => console.log("error", error));
    // appoint.socket.end();
    // appoint.socket = socket;
    console.log("Music mode activated");
    globalAppoint = appoint;
  });

  server.listen(54321, "192.168.0.19", () =>
    console.log("listening on 192.168.0.19:54321")
  );

  // await appoint.command({
  //   method: "set_music",
  //   params: [1, "192.168.0.19", 54321],
  // });

  globalAppoint = appoint;
};

setup();

export const setBright = async (
  intensity,
  effect = "smooth",
  duration = 500
) => {
  const numericalIntensity = Number(intensity);
  await globalAppoint.command({
    method: "set_bright",
    params: [numericalIntensity, effect, duration],
  });
};

export const setOn = async (effect = "smooth", duration = 500, mode = 0) => {
  await globalAppoint.command({
    method: "set_power",
    params: ["on", effect, duration, mode],
  });
};

export const setOff = async (effect = "smooth", duration = 500) => {
  await globalAppoint.command({
    method: "set_power",
    params: ["off", effect, duration],
  });
};

export const increaseColorTemperature = async (value = 10, duration = 200) => {
  await globalAppoint.command({
    method: "adjust_ct",
    params: [value, duration],
  });
};

export const decreaseColorTemperature = async (value = 10, duration = 200) => {
  await globalAppoint.command({
    method: "adjust_ct",
    params: [-value, duration],
  });
};

export const increaseBrightness = async (value = 10, duration = 200) => {
  await globalAppoint.command({
    method: "adjust_bright",
    params: [value, duration],
  });
};

export const decreaseBrightness = async (value = 10, duration = 200) => {
  await globalAppoint.command({
    method: "adjust_bright",
    params: [-value, duration],
  });
};
