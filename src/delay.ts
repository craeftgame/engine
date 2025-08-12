import Timer from "./tools/timer";

export default class Delay {
  timer;
  onDelayExpired;

  isDelaying = true;

  finish() {
    this.isDelaying = false;
    if (this.onDelayExpired) {
      this.onDelayExpired();
    }
  }

  constructor({
    // @ts-ignore
    delayInSeconds,
    // @ts-ignore
    onDelayExpired,
  } = {}) {
    this.onDelayExpired = onDelayExpired;

    if (delayInSeconds > -1) {
      this.timer = new Timer({
        callback: () => {
          this.finish();
        },
        delay: delayInSeconds,
        autoStart: true,
      });
    } else {
      this.finish();
    }
  }

  static hydrate(obj) {
    const delay = Object.assign(new Delay(), obj);

    delay.timer = Timer.hydrate(obj.timer);

    return delay;
  }
}
