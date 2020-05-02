import Leap from "leapjs";
import { clamp, throttle, get, getOr } from "lodash/fp";
import {
  setBright,
  setOn,
  setOff,
  increaseColorTemperature,
  decreaseColorTemperature,
} from "./actions";

const throttledSetBright = throttle(200, setBright);
const throttledIncreaseColorTemperature = throttle(
  200,
  increaseColorTemperature
);
const throttledDecreaseColorTemperature = throttle(
  200,
  decreaseColorTemperature
);
const throttledLog = throttle(50, console.log);

const controller = Leap.loop(
  { enableGestures: true },
  (frame) => {
    const hand = frame.hands[0];

    if (hand) {
      const centerCorrectionFactor = hand.type === "right" ? 0.5 : -0.5;
      const sensitivyFactor = 2;
      const angle = clamp(
        0,
        1,
        (hand.roll() / Math.PI) * sensitivyFactor + 0.5 + centerCorrectionFactor
      );

      const correctedAngle = hand.type === "right" ? 1 - angle : angle;
      const value = clamp(1, 99, Math.floor(correctedAngle * 100));
      hand.sphereRadius > 80 && throttledSetBright(value, "smooth", 200);
    }
  }
  //   console.log(frame.gestures.length)
);

const circleGestureMap = {};
controller.on("gesture", (gesture) => {
  const { hands, ...base } = gesture;
  // console.log(base);

  if (gesture.type === "swipe" && gesture.state === "stop") {
    if (gesture.direction[1] > 0.5 && gesture.direction[1] <= 1) {
      console.log("ON");
      setOn();
    } else if (gesture.direction[1] < -0.5 && gesture.direction[1] >= -1) {
      console.log("OFF");
      setOff();
    }
  }

  if (gesture.type === "circle" && gesture.state === "update") {
    if (gesture.normal[2] > 0.5 && gesture.normal[2] <= 1) {
      // const previousGestureState = get(gesture.id, circleGestureMap);

      // console.log(
      //   getOr(0, "lastProgress", previousGestureState),
      //   gesture.progress - getOr(0, "lastProgress", previousGestureState)
      // );
      // if (
      //   gesture.progress - getOr(0, "lastProgress", previousGestureState) >=
      //   0.2
      // ) {
      //   clearTimeout(get("timeout", previousGestureState));
      //   decreaseColorTemperature();
      //   circleGestureMap[gesture.id] = {
      //     timeout: setTimeout(() => {
      //       console.log("decrease", circleGestureMap);
      //       delete circleGestureMap[gesture.id];
      //       console.log(circleGestureMap);
      //     }, 500),
      //     lastProgress: gesture.progress,
      //   };
      // }

      throttledDecreaseColorTemperature();
    } else if (gesture.normal[2] < -0.5 && gesture.normal[2] >= -1) {
      console.log("increase");
      throttledIncreaseColorTemperature();
    }
  }
});
