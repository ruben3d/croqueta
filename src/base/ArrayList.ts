
import { IterableCollection, CollectionIterator, NoSuchElementException } from "./IterableCollection"

class ArrayListIterator<T> implements CollectionIterator<T> {

    private list: Array<T>;
    private idx: number;

    constructor(list: Array<T>) {
        this.idx = 0;
        this.list = list;
    }

    next(): T {
        if (!this.hasNext()) {
            throw new NoSuchElementException();
        }
        return this.list[this.idx++]
    }

    hasNext(): boolean {
        return this.idx < this.list.length;
    }
}

export class ArrayList<T> implements IterableCollection<T> {

    private list: Array<T>;

    constructor(...items: T[]) {
        this.list = items;
    }

    iterator(): CollectionIterator<T> {
        return new ArrayListIterator(this.list);
    }

    set(idx: number, value: T): void {
        this.list[idx] = value;
    }

    get(idx: number): T {
        return this.list[idx];
    }

    pushBack(value: T): void {
        this.list.push(value);
    }

    remove(idx: number): void {
        this.list.splice(idx, 1);
    }

    removeValue(value: T): void {
        let i = this.list.indexOf(value);
        if (i > -1) {
            this.remove(i);
        }
    }

    forEach(f: (e: T) => void): void {
        let it = this.iterator();
        while (it.hasNext()) {
            f(it.next());
        }
    }
}
