
import { AssertionErrorException } from "./Exceptions"

export function assert(cond: boolean, msg: string = "") {
    if (!cond) {
        let m = "Assertion failed: '" + msg + "'";
        console.error(m);
        throw new AssertionErrorException(m);
    }
}
