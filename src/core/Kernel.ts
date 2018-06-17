import { EventManager } from "./EventManager";
import { KernelTask } from "./KernelTask";

class TimeHistory {
    private deltas: Array<number>;
    private idx: number;
    private prevTime: number;

    constructor(size: number) {
        this.deltas = new Array(size).fill(0.001);
        this.idx = 0;
        this.prevTime = performance.now();
    }

    update(): void {
        let current = performance.now();
        this.deltas[this.idx] = current - this.prevTime;
        this.idx += 1;
        this.idx %= this.deltas.length;
        this.prevTime = current;
    }

    get(): number {
        var acc = 0;
        this.deltas.forEach(delta => {
            acc += delta;
        });
        return acc / this.deltas.length;
    }
}

export class Kernel {

    private enabled: boolean;
    //private eventManager: EventManager;
    private tasks: Array<KernelTask>;
    private history: TimeHistory;

    constructor(eventManager: EventManager, histSize: number) {
        this.enabled = false;
        //this.eventManager = eventManager;
        this.tasks = new Array<KernelTask>();
        this.history = new TimeHistory(histSize);
    }

    addTask(task: KernelTask): void {
        this.tasks.push(task);
    }

    start(): void {
        if (!this.enabled) {
            this.enabled = true;
            window.requestAnimationFrame(() => this.update());
        }
    }

    stop(): void {
        this.enabled = false;
    }

    private update(): void {
        this.history.update();
        let delta = this.history.get();

        this.tasks.forEach(task => {
            task.update(delta);
        });

        if (this.enabled) {
            window.requestAnimationFrame(() => this.update());
        }
    }

}
