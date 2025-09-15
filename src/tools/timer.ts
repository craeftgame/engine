import { config } from "../config";
import { CraeftMixin, HydrateableMixin } from "./mixins";
import type { ICraeft } from "../interfaces";

export class Timer extends CraeftMixin(HydrateableMixin()) {
  delay: number = 0;
  remaining: number = 0;
  startDate: Date = new Date();
  running: boolean = false;
  onTimerEnd?: () => void;
  ticker?: number;

  constructor({
    craeft,
    onTimerEnd,
    delay,
    autoStart = true,
  }: { craeft: ICraeft } & Partial<{
    onTimerEnd: () => void;
    delay: number;
    autoStart: boolean;
  }>) {
    super(craeft);

    this.onTimerEnd = onTimerEnd;

    // make it milliseconds
    this.delay = (delay ? delay : 0) * 1000;
    this.remaining = this.delay;

    if (config.instant) {
      this.delay = 5;
      this.start();
    }

    if (autoStart) {
      this.start();
    }
  }

  public static hydrate(craeft: ICraeft, timer: Timer) {
    const newTimer = Object.assign(new Timer({ craeft }), timer);

    if (newTimer.remaining > 0) {
      newTimer.delay = newTimer.remaining;
      newTimer.start();
    }

    return newTimer;
  }

  private tick() {
    this.remaining = this.delay - (+new Date() - +this.startDate);

    if (this.remaining <= 0 || this.remaining === 0) {
      this.triggerCallback();
    }
  }

  private triggerCallback() {
    if (this.running) {
      this.onTimerEnd?.();
    }

    this.pause();
  }

  public start() {
    this.running = true;
    this.startDate = new Date();

    if (typeof window !== "undefined") {
      this.ticker = window.setInterval(
        () => this.tick(),
        config.tickerTick * 1000,
      );
    }

    this.tick();
  }

  public pause() {
    this.running = false;

    if (this.ticker) {
      window.clearInterval(this.ticker);
      delete this.ticker;
    }
  }

  public getTimeLeft() {
    return this.remaining;
  }

  public getTimeLeftInSeconds() {
    return Math.round(this.getTimeLeft() / 1000);
  }

  public getTimeoutString() {
    const timeoutInSeconds = this.getTimeLeftInSeconds();

    const mins = Math.floor(timeoutInSeconds / 60);

    if (mins > 60) {
      const hours = Math.floor(mins / 60);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `~${days} Day`;
      }

      return `~${hours} Hrs`;
    }

    if (mins > 0) {
      return `~${mins} Min`;
    }

    return `${timeoutInSeconds} Sec`;
  }
}
