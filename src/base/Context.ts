
import { Option } from "./Option"

export class Context {
    private parent: Option<Context>;
    private vars: Map<string, any>;

    constructor(parent?: Context) {
        this.vars = new Map<string, any>();
        this.parent = Option(parent);
    }

    get<T>(key: string): Option<T> {
        return Option(this.vars.get(key)).orElse(() => this.parent.flatMap<T>((p) => p.get(key)));
    }

    set<T>(key: string, value: T): void {
        this.vars.set(key, value);
    }
}
