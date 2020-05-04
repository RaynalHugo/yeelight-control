import Leap from "leapjs";

import { connectToBulb, write$ } from "./connect";
import { handlers } from "./handlers";
import { log } from "./logger";

import { fromEvent, of, asyncScheduler, from } from "rxjs";
import {
  tap,
  filter,
  groupBy,
  map,
  mergeMap,
  throttleTime,
  withLatestFrom,
  catchError,
} from "rxjs/operators";

connectToBulb();
const controller = Leap.loop({ enableGestures: true }, () => null);

// hardcoded bulb id observable
const bulbId$ = of(0x0000000007d02fcc);

// create gesture commands
const gestures$ = fromEvent(controller, "gesture").pipe(
  mergeMap((values) => from(values)),
  throttleTime(200, asyncScheduler, { leading: true, trailing: true }),
  groupBy((gesture) => gesture.type),
  filter((group$) => group$.key in handlers),
  mergeMap((group$) => handlers[group$.key](group$))
);

// Apply id to commands
const commands$ = gestures$.pipe(
  withLatestFrom(bulbId$),
  map(([addIdToCommand, id]) => addIdToCommand(id)),
  tap((command) =>
    log(`Sent command: ${command.substring(0, command.length - 2)}`)
  ),
  withLatestFrom(write$),
  catchError((err, caught) => {
    log(`Caught the following error: ${err}`);
    connectToBulb();
    return caught;
  }),
  map(([command, writeCommand]) => writeCommand(command))
);

commands$.subscribe();
