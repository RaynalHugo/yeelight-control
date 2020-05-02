import { Bulb } from "yeelight-connector";

import { test } from "./test";

import { toggle } from "./toggle";
import { setRgb } from "./set-rgb";
import { setBright } from "./set-bright";

const express = require("express");
const app = express();

const SERVER_PORT = 4000;

const BULB_PORT = 55443;
const HOST = "192.168.0.16";

const appoint = new Bulb(0x0000000007d02fcc, HOST, BULB_PORT);
appoint.init();

app.get("/test", function(req, res) {
  test();
  res.send("Hello World!");
});

app.get("/toggle", function(req, res) {
  toggle(appoint)();
  res.send("Toggled");
});

app.get("/debug", function(req, res) {
  res.send("Toggled");
});

app.get("/set-rgb", function(req, res) {
  const { color } = req.query;
  setRgb(appoint)(color);
  res.send("set Color");
});

app.get("/set-bright", function(req, res) {
  const { intensity } = req.query;
  setBright(appoint)(intensity);
  res.send("set intensity");
});

app.listen(SERVER_PORT, function() {
  console.log(`Example app listening on port ${SERVER_PORT}!`);
});
