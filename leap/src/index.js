import Leap from "leapjs";

import {
  setBright,
  setOn,
  setOff,
  increaseColorTemperature,
  decreaseColorTemperature,
} from "./old/actions";

import { fromEvent, Subject, from, of, asyncScheduler } from "rxjs";
import {
  tap,
  pluck,
  map,
  scan,
  groupBy,
  multicast,
  concatAll,
  merge,
  concatMap,
  mergeMap,
  throttleTime,
  filter,
} from "rxjs/operators";

const controller = Leap.loop({ enableGestures: true }, () => null);

const onCircleHandler = (gesture) => {
  if (gesture.normal[2] > 0.5 && gesture.normal[2] <= 1) {
    decreaseColorTemperature(5, 200);
  } else if (gesture.normal[2] < -0.5 && gesture.normal[2] >= -1) {
    increaseColorTemperature(5, 200);
  }
};

const onSwipeHandler = (gesture) => {
  if (gesture.type === "swipe" && gesture.state === "stop") {
    if (gesture.direction[1] > 0.5 && gesture.direction[1] <= 1) {
      console.log("ON");
      setOn();
    } else if (gesture.direction[1] < -0.5 && gesture.direction[1] >= -1) {
      console.log("OFF");
      setOff();
    }
  }
};

const handlers = { circle: onCircleHandler, swipe: onSwipeHandler };

const gestures = fromEvent(controller, "gesture").pipe(
  mergeMap((values) => of(...values)),
  groupBy((gesture) => gesture.type),
  filter((group) => group.key in handlers),
  map((group) => {
    const gestureType = group.key;

    if (gestureType in handlers) {
      return group
        .pipe(
          throttleTime(200, asyncScheduler, { leading: true, trailing: true })
        )
        .subscribe(handlers[group.key]);
    } else {
      return group;
    }
  })
);

gestures.subscribe(console.log);

// subject1.subscribe((value) => console.log("1: ", value));
// subject2.subscribe((value) => console.log("2: ", value[0].type));

// multicasted.connect();
