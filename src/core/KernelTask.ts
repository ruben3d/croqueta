import { Task } from "./Task";
import { Context } from "../base/Context"

export abstract class KernelTask implements Task {

    protected readonly name: string;
    protected readonly context: Context;

    constructor(name: string, applicationContext: Context) {
        this.name = name;
        this.context = applicationContext;
    }

    abstract update(delta: number): void;
}
