const PORT = 1982;
const HOST = "192.168.0.19";
// const HOST = "239.255.255.250";

const MULTICAST_ADDR = "239.255.255.250";

const dgram = require("dgram");
const process = require("process");
const message = `M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1982\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n`;

export async function search() {
  const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  socket.bind(PORT);

  socket.on("listening", function() {
    socket.addMembership(MULTICAST_ADDR);
    setInterval(sendMessage, 2500);
    const address = socket.address();
    console.log(
      `UDP socket listening on ${address.address}:${address.port} pid: ${process.pid}`
    );
  });

  function sendMessage() {
    socket.send(message, 0, message.length, PORT, MULTICAST_ADDR, function() {
      console.info(`Sending message "${message}"`);
    });
  }

  socket.on("message", function(message, rinfo) {
    console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
  });

  // console.log(result);
}

// search();
