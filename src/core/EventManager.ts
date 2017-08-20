
import { Option } from "../base/Option"
import { ArrayList } from "../base/ArrayList"

export abstract class Event<T> {

    readonly name: string;

    constructor(name: string, unused?: T) {
        this.name = name;
    }
}

export interface EventListener<T extends Event<T>> {
    onEvent(event: T): void;
}

export class EventManager {

    private listeners: Map<string, ArrayList<any>>;

    constructor() {
        this.listeners = new Map<string, ArrayList<any>>();
    }

    addEventListener<T extends EventListener<U>, U extends Event<U>>(eventName: string, listener: T): void {
        let list = Option(this.listeners.get(eventName)).map((l) => {
            l.pushBack(listener);
            return l;
        }).getOrElse(() => new ArrayList<any>(listener));

        this.listeners.set(eventName, list);
    }

    removeEventListener<T extends EventListener<U>, U extends Event<U>>(eventName: string, listener: T): void {
        Option(this.listeners.get(eventName)).forEach((listeners) => {
            listeners.removeValue(listener);
        });
    }

    triggerEvent<T extends Event<T>>(event: T): void {
        Option(this.listeners.get(event.name)).forEach((listeners) => {
            listeners.forEach(listener => {
                let l = listener as EventListener<T>;
                l.onEvent(event);
            });
        });
    }
}
