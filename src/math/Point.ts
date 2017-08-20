import { Coord4D } from "./Coord4D";
import { Vector } from "./Vector";
import { Cloneable } from "../base/Cloneable";
import { Copyable } from "../base/Copyable";

export class Point extends Coord4D implements Cloneable<Point>, Copyable<Point> {

    /**
     * Creates an instance of Point.
     * @param {number} [_x=0.0] 
     * @param {number} [_y=0.0] 
     * @param {number} [_z=0.0] 
     * @memberof Point
     */
    constructor(_x: number = 0.0, _y: number = 0.0, _z: number = 0.0) {
        super(_x, _y, _z, 1.0);
    }

    set(_x: number, _y: number, _z: number): Point {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        return this;
    }

    clone(): Point {
        return new Point(this.x, this.y, this.z);
    }

    copyFrom(other: Point): Point {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    add(v: Vector): Point {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    constAdd(v: Vector): Point {
        return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v: Vector): Point {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    constSub(v: Vector): Point {
        return new Point(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mul(n: number): Point {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    constMul(n: number): Point {
        return new Point(this.x * n, this.y * n, this.z * n);
    }

    div(n: number): Point {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }

    constDiv(n: number): Point {
        return new Point(this.x / n, this.y / n, this.z / n);
    }
}
