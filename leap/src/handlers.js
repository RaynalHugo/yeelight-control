import { map, filter } from "rxjs/operators";

import {
  setOn,
  setOff,
  increaseColorTemperature,
  decreaseColorTemperature,
  increaseBrightness,
  decreaseBrightness,
} from "./actions";
const onCircleHandler = (gesturesObservable) => {
  const handler = (gesture) => {
    if (gesture.normal[2] > 0.5 && gesture.normal[2] <= 1) {
      return increaseColorTemperature(5, 300);
    } else if (gesture.normal[2] < -0.5 && gesture.normal[2] >= -1) {
      return decreaseColorTemperature(5, 300);
    }
  };
  return gesturesObservable.pipe(
    filter(({ radius }) => radius > 25),
    map(handler)
  );
};

const onSwipeHandler = (gesturesObservable) => {
  const handler = (gesture) => {
    if (gesture.direction[1] > 0.5 && gesture.direction[1] <= 1) {
      return setOn();
    } else if (gesture.direction[1] < -0.5 && gesture.direction[1] >= -1) {
      return setOff();
    } else {
      if (gesture.direction[0] > 0.5 && gesture.direction[0] <= 1) {
        return decreaseBrightness(10, 200);
      } else if (gesture.direction[0] < -0.5 && gesture.direction[0] >= -1) {
        return increaseBrightness(10, 200);
      }
    }
  };

  return gesturesObservable.pipe(map(handler));
};

export const handlers = { circle: onCircleHandler, swipe: onSwipeHandler };
