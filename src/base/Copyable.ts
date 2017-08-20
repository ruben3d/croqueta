
export interface Copyable<T> {
    copyFrom(other: T): T;
}
