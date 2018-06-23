
export abstract class CroquetaException extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class WebGL2NotSupportedException extends CroquetaException {};

export class AssertionErrorException extends CroquetaException {
    constructor(msg: string) {super(msg)}
};

export class NoSuchElementException extends CroquetaException {};

export class MissingParameterException extends CroquetaException {
    constructor(msg: string) {super(msg)}
};

export class ShaderException extends CroquetaException {
    constructor(msg: string) {super(msg)}
};
