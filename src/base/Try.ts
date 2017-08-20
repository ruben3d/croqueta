
import { Option, Some, None } from "./Option";

export function Success<T>(value: T): Try<T> {
    return new SuccessImpl(value);
}

export function Failure<T>(error: Error): Try<T> {
    return new FailureImpl(error);
}

export function Try<T>(f: () => T): Try<T> {
    try {
        return Success(f());
    } catch (error) {
        return Failure(error);
    }
}

export interface Try<T> {

    isSuccess(): boolean;
    isFailure(): boolean;

    get(): T;
    getOrElse(other: () => T): T;
    orElse(f: () => Try<T>): Try<T>;

    fold<U>(f: (e: Error) => U, s: (v: T) => U): U
    transform<U>(s: (v: T) => Try<U>, f: (e: Error) => Try<U>): Try<U>

    forEach(f: (v: T) => void): void;
    filter(f: (v: T) => boolean): Try<T>;
    flatMap<U>(f: (v: T) => Try<U>): Try<U>;
    map<U>(f: (v: T) => U): Try<U>;

    recover(f: (e: Error) => T): Try<T>;
    recoverWith(f: (e: Error) => Try<T>): Try<T>;

    toOption(): Option<T>;
}

class SuccessImpl<T> implements Try<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    isSuccess(): boolean {
        return true;
    }

    isFailure(): boolean {
        return false;
    }

    get(): T {
        return this.value;
    }

    getOrElse(other: () => T): T {
        return this.value;
    }

    orElse(f: () => Try<T>): Try<T> {
        return this;
    }

    fold<U>(f: (e: Error) => U, s: (v: T) => U): U {
        return s(this.value);
    }

    transform<U>(s: (v: T) => Try<U>, f: (e: Error) => Try<U>): Try<U> {
        return s(this.value);
    }

    forEach(f: (value: T) => void): void {
        f(this.value);
    }

    filter(f: (value: T) => boolean): Try<T> {
        return f(this.value) ? this : Failure(new Error());
    }

    flatMap<U>(f: (value: T) => Try<U>): Try<U> {
        return f(this.value);
    }

    map<U>(f: (value: T) => U): Try<U> {
        return Success(f(this.value));
    }

    recover(f: (e: Error) => T): Try<T> {
        return this;
    }

    recoverWith(f: (e: Error) => Try<T>): Try<T> {
        return this;
    }

    toOption(): Option<T> {
        return Some(this.value);
    }
}

class FailureImpl<T> implements Try<T> {

    error: Error;

    constructor(error: Error) {
        this.error = error;
    }

    isSuccess(): boolean {
        return false;
    }

    isFailure(): boolean {
        return true;
    }

    get(): T {
        throw this.error;
    }

    getOrElse(other: () => T): T {
        return other();
    }

    orElse(f: () => Try<T>): Try<T> {
        return f();
    }

    fold<U>(f: (e: Error) => U, s: (v: T) => U): U {
        return f(this.error);
    }

    transform<U>(s: (v: T) => Try<U>, f: (e: Error) => Try<U>): Try<U> {
        return f(this.error);
    }

    forEach(f: (value: T) => void): void {
        // Empty
    }

    filter(f: (value: T) => boolean): Try<T> {
        return this; // No need to instance another copy, it's immutable
    }

    flatMap<U>(f: (value: T) => Try<U>): Try<U> {
        return Failure(this.error);
    }

    map<U>(f: (value: T) => U): Try<U> {
        return Failure(this.error);
    }

    recover(f: (e: Error) => T): Try<T> {
        return Try(() => f(this.error));
    }

    recoverWith(f: (e: Error) => Try<T>): Try<T> {
        return f(this.error)
    }

    toOption(): Option<T> {
        return None();
    }
}
