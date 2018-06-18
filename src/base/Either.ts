import { Option, Some, None } from "./Option";

export function Right<L, R>(value: R): Either<L, R> {
    return new RightImpl(value);
}

export function Left<L, R>(value: L): Either<L, R> {
    return new LeftImpl(value);
}

/**
 * Right biased
 */
export interface Either<L, R> {

    isLeft(): boolean;
    isRight(): boolean;

    getOrElse(other: () => R): R;

    fold<U>(l: (v: L) => U, r: (v: R) => U): U;

    forEach(f: (v: R) => void): void;
    filterOrElse(f: (v: R) => boolean, zero: () => L): Either<L, R>;
    flatMap<U>(f: (v: R) => Either<L, U>): Either<L, U>;
    map<U>(f: (v: R) => U): Either<L, U>;

    swap(): Either<R, L>;

    toOption(): Option<R>;
}

class RightImpl<L, R> implements Either<L, R> {
    private value: R;

    constructor(value: R) {
        this.value = value;
    }

    isLeft(): boolean {
        return false;
    }

    isRight(): boolean {
        return true;
    }

    getOrElse(other: () => R): R {
        return this.value;
    }

    fold<U>(l: (v: L) => U, r: (v: R) => U): U {
        return r(this.value);
    }

    forEach(f: (value: R) => void): void {
        f(this.value);
    }

    filterOrElse(f: (v: R) => boolean, zero: () => L): Either<L, R> {
        return f(this.value) ? this : Left(zero());
    }

    flatMap<U>(f: (v: R) => Either<L, U>): Either<L, U> {
        return f(this.value);
    }

    map<U>(f: (v: R) => U): Either<L, U> {
        return Right(f(this.value));
    }

    swap(): Either<R, L> {
        return Left(this.value);
    }

    toOption(): Option<R> {
        return Some(this.value);
    }
}

class LeftImpl<L, R> implements Either<L, R> {

    private value: L;

    constructor(value: L) {
        this.value = value;
    }

    isLeft(): boolean {
        return true;
    }

    isRight(): boolean {
        return false;
    }

    getOrElse(other: () => R): R {
        return other();
    }

    fold<U>(l: (v: L) => U, r: (v: R) => U): U {
        return l(this.value);
    }

    forEach(f: (value: R) => void): void {
        // Empty
    }

    filterOrElse(f: (v: R) => boolean, zero: () => L): Either<L, R> {
        return this; // No need to instance another copy, it's immutable
    }

    flatMap<U>(f: (v: R) => Either<L, U>): Either<L, U> {
        return Left(this.value);
    }

    map<U>(f: (v: R) => U): Either<L, U> {
        return Left(this.value);
    }

    swap(): Either<R, L> {
        return Right(this.value);
    }

    toOption(): Option<R> {
        return None();
    }
}
