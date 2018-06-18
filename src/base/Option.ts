
import { NoSuchElementException } from "./Exceptions"

export function Some<T>(value: T): Option<T> {
    return new SomeImpl(value);
}

export function None<T>(): Option<T> {
    return new NoneImpl();
}

export function Option<T>(value: T | null | undefined): Option<T> {
    if (value === null || typeof value === 'undefined') {
        return None();
    } else {
        return Some(value);
    }
}

export interface Option<T> {
    isEmpty(): boolean;
    nonEmpty(): boolean;

    get(): T;
    getOrElse(other: () => T): T;
    orNull(): T | null;
    orUndefined(): T | undefined;
    orElse(f: () => Option<T>): Option<T>;

    fold<U>(ifEmpty: () => U, f: (v: T) => U): U;
    forEach(f: (v: T) => void): void;
    filter(f: (v: T) => boolean): Option<T>;
    flatMap<U>(f: (v: T) => Option<U>): Option<U>;
    map<U>(f: (v: T) => U): Option<U>;

    toArray(): Array<T>;
}

class SomeImpl<T> implements Option<T> {

    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    isEmpty(): boolean {
        return false;
    }

    nonEmpty(): boolean {
        return true;
    }

    get(): T {
        return this.value;
    }

    getOrElse(other: () => T): T {
        return this.value;
    }

    orNull(): T | null {
        return this.value;
    }

    orUndefined(): T | undefined {
        return this.value;
    }

    orElse(f: () => Option<T>): Option<T> {
        return this;
    }

    fold<U>(ifEmpty: () => U, f: (v: T) => U): U {
        return f(this.value);
    }

    forEach(f: (value: T) => void): void {
        f(this.value);
    }

    filter(f: (value: T) => boolean): Option<T> {
        return f(this.value) ? this : None();
    }

    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
        return f(this.value);
    }

    map<U>(f: (value: T) => U): Option<U> {
        return Some(f(this.value));
    }

    toArray(): Array<T> {
        return [this.value];
    }
}

class NoneImpl<T> implements Option<T> {

    isEmpty(): boolean {
        return true;
    }

    nonEmpty(): boolean {
        return false;
    }

    get(): T {
        throw new NoSuchElementException();
    }

    getOrElse(other: () => T): T {
        return other();
    }

    orNull(): T | null {
        return null;
    }

    orUndefined(): T | undefined {
        return undefined;
    }

    orElse(f: () => Option<T>): Option<T> {
        return f();
    }

    fold<U>(ifEmpty: () => U, f: (v: T) => U): U {
        return ifEmpty();
    }

    forEach(f: (value: T) => void): void {
        // Empty
    }

    filter(f: (value: T) => boolean): Option<T> {
        return this; // No need to instance another copy, it's immutable
    }

    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
        return None();
    }

    map<U>(f: (value: T) => U): Option<U> {
        return None();
    }

    toArray(): Array<T> {
        return [];
    }
}
