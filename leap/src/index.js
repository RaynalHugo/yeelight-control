import Leap from "leapjs";

import {
  setOn,
  setOff,
  increaseColorTemperature,
  decreaseColorTemperature,
  increaseBrightness,
  decreaseBrightness,
} from "./old/actions";

import { fromEvent, of, asyncScheduler } from "rxjs";
import { map, groupBy, mergeMap, throttleTime, filter } from "rxjs/operators";

const controller = Leap.loop({ enableGestures: true }, () => null);

const onCircleHandler = (gesture) => {
  if (gesture.normal[2] > 0.5 && gesture.normal[2] <= 1) {
    increaseColorTemperature(5, 200);
  } else if (gesture.normal[2] < -0.5 && gesture.normal[2] >= -1) {
    decreaseColorTemperature(5, 200);
  }
};

const onSwipeHandler = (gesture) => {
  //   if (gesture.type === "swipe") {
  console.log(gesture.direction);
  if (gesture.direction[1] > 0.5 && gesture.direction[1] <= 1) {
    setOn();
  } else if (gesture.direction[1] < -0.5 && gesture.direction[1] >= -1) {
    setOff();
  } else {
    if (gesture.direction[0] > 0.5 && gesture.direction[0] <= 1) {
      decreaseBrightness(10, 200);
    } else if (gesture.direction[0] < -0.5 && gesture.direction[0] >= -1) {
      increaseBrightness(10, 200);
    }
  }
  //   }
};

const handlers = { circle: onCircleHandler, swipe: onSwipeHandler };

const gestures = fromEvent(controller, "gesture").pipe(
  mergeMap((values) => of(...values)),
  throttleTime(200, asyncScheduler, { leading: true, trailing: true }),
  groupBy((gesture) => gesture.type),
  filter((group) => group.key in handlers),
  map((group) => {
    const gestureType = group.key;

    if (gestureType in handlers) {
      return group
        .pipe
        //   throttleTime(200, asyncScheduler, { leading: true, trailing: true })
        ()
        .subscribe(handlers[group.key]);
    } else {
      return group;
    }
  })
);

gestures.subscribe(console.log);
