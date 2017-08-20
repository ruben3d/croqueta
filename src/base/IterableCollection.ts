
export { NoSuchElementException } from "./Exceptions"

export interface CollectionIterator<T> {
    next(): T;
    hasNext(): boolean;
}

export interface IterableCollection<T> {
    iterator(): CollectionIterator<T>;
    forEach(f: (e: T) => void): void;
}
