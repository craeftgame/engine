import { Timer } from "./timer";
import { CraeftMixin, HydrateableMixin } from "./mixins";
import type { ICraeft } from "../interfaces";

export class Delay extends CraeftMixin(HydrateableMixin()) {
  timer: Timer | undefined;
  onDelayExpired?: () => void;

  isDelaying = true;

  finish() {
    this.isDelaying = false;
    if (this.onDelayExpired) {
      this.onDelayExpired();
    }
  }

  constructor({
    craeft,
    delayInSeconds,
    onDelayExpired,
  }: { craeft: ICraeft } & Partial<{
    delayInSeconds: number;
    onDelayExpired: () => void;
  }>) {
    super(craeft);

    this.onDelayExpired = onDelayExpired;

    if (delayInSeconds && delayInSeconds > -1) {
      this.timer = new Timer({
        craeft: this.craeft,
        onTimerEnd: () => {
          this.finish();
        },
        delay: delayInSeconds,
        autoStart: true,
      });
    } else {
      this.finish();
    }
  }

  public static hydrate(craeft: ICraeft, delay: Delay): Delay {
    const newDelay = Object.assign(new Delay({ craeft }), delay);

    if (delay.timer) {
      newDelay.timer = Timer.hydrate(craeft, delay.timer);
    }

    return newDelay;
  }
}
