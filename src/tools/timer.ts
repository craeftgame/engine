import config from "../../config";

export default class Timer {

    delay: number = 0;
    remaining: number = 0;
    startDate: Date = new Date();
    running: boolean = false;
    callback: { (): void };
    ticker: number | null = null;

    constructor(
        {
            callback,
            delay,
            autoStart = true
        }: {
            callback?: any
            delay?: number
            autoStart?: boolean
        } = {}
    ) {
        this.callback = callback;

        // make it milliseconds
        this.delay = (delay ? delay : 0) * 1000;
        this.remaining = this.delay;

        if (config.instant) {
            this.delay = 5;
            this.start()
        }

        if (autoStart) {
            this.start();
        }
    }

    static hydrate(
        obj
    ) {
        const timer = Object.assign(new Timer(), obj);

        if (timer.remaining > 0) {
            timer.delay = timer.remaining;
            timer.start();
        }

        return timer;
    }

    private tick() {
        this.remaining = this.delay - (+new Date() - +this.startDate);

        if (this.remaining <= 0 || this.remaining === 0) {
            this.triggerCallback()
        }
    }

    private triggerCallback() {
        if (this.running && this.callback) {
            this.callback()
        }

        this.pause();
    }

    public start() {
        this.running = true;
        this.startDate = new Date();

        this.ticker = window.setInterval(
            () => this.tick(),
            config.tickerTick * 1000
        );

        this.tick();
    }

    public pause() {
        this.running = false;

        if (this.ticker) {
            window.clearInterval(this.ticker);
            this.ticker = null;
        }
    }

    public getTimeLeft() {
        return this.remaining
    }

    public getTimeLeftInSeconds() {
        return Math.round(this.getTimeLeft() / 1000)
    }

    public getTimeoutString() {
        const timeoutInSeconds = this.getTimeLeftInSeconds();

        const mins = Math.floor(timeoutInSeconds / 60);

        if (mins > 60) {
            const hours = Math.floor(mins / 60);

            if (hours > 24) {
                const days = Math.floor(hours / 24);
                return `~${days} Day`
            }

            return `~${hours} Hrs`
        }

        if (mins > 0) {
            return `~${mins} Min`
        }

        return `${timeoutInSeconds} Sec`
    }
}
