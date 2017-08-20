
export abstract class Coord4D {

    x: number;
    y: number;
    z: number;
    w: number;

    constructor(_x: number = 0.0, _y: number = 0.0, _z: number = 0.0, _w: number = 0.0) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
    }

    getter(idx: number): number {
        switch (idx) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            case 3:
                return this.w;
            default:
                throw new RangeError("The index '" + idx + "' is out of the range [0,3].");
        }
    }

    setter(idx: number, value: number): void {
        switch (idx) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            case 3:
                this.w = value;
                break;
            default:
                throw new RangeError("The index '" + idx + "' is out of the range [0,3].");
        }
    }
}
