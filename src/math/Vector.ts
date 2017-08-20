import { Coord4D } from "./Coord4D";
import { Point } from "./Point";
import { Cloneable } from "../base/Cloneable";
import { Copyable } from "../base/Copyable";
import { Option, Some, None } from "../base/Option";

export class Vector extends Coord4D implements Cloneable<Vector>, Copyable<Vector> {

    constructor(_x: number = 0.0, _y: number = 0.0, _z: number = 0.0) {
        super(_x, _y, _z, 0.0);
    }

    static FromPoints(p1: Point, p0: Point): Vector {
        return new Vector(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
    }

    set(_x: number, _y: number, _z: number): Vector {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        return this;
    }

    clone(): Vector {
        return new Vector(this.x, this.y, this.z);
    }

    copyFrom(other: Vector): Vector {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    constAdd(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    constSub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mul(n: number): Vector {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    constMul(n: number): Vector {
        return new Vector(this.x * n, this.y * n, this.z * n);
    }

    div(n: number): Vector {
        let inv = 1.0 / n;
        this.x *= inv;
        this.y *= inv;
        this.z *= inv;
        return this;
    }

    constDiv(n: number): Vector {
        let inv = 1.0 / n;
        return new Vector(this.x * inv, this.y * n, this.z * n);
    }

    neg(): Vector {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    constNeg(): Vector {
        return new Vector(-this.x, -this.y, -this.z);
    }

    normalize(): Vector {
        return this.div(this.length());
    }

    constNormalize(): Vector {
        return this.constDiv(this.length());
    }

    lengthSq(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length(): number {
        return Math.sqrt(this.lengthSq());
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector): Vector {
        let vx = this.y * v.z - this.z * v.y;
        let vy = this.z * v.x - this.x * v.z;
        let vz = this.x * v.y - this.y * v.x;
        this.x = vx;
        this.y = vy;
        this.z = vz;
        return this;
    }

    constCross(v: Vector): Vector {
        let vx = this.y * v.z - this.z * v.y;
        let vy = this.z * v.x - this.x * v.z;
        let vz = this.x * v.y - this.y * v.x;
        return new Vector(vx, vy, vz);
    }

    reflect(normal: Vector): Vector {
        let tmp = this.constReflect(normal);
        return this.copyFrom(tmp);
    }

    constReflect(normal: Vector): Vector {
        return normal.constMul(2 * normal.dot(this)).sub(this);
    }

    /** The current vector is assumed to be pointing towards the surface.
     * @param {Vector} normal   Surface normal.
     * @param {number} n1       First medium IOR.
     * @param {number} n2       Second medium IOR.
     * @returns {Option<Vector>}    If total internal reflection does not occur Some refracted vector. Otherwise None.
     * @memberof Vector
     */
    constRefract(normal: Vector, n1: number, n2: number): Option<Vector> {
        let n = n1 / n2;
        let cosI = normal.dot(this);
        let sinT2 = n * n * (1.0 - cosI * cosI);
        if (sinT2 > 1.0) {
            return None();
        }
        let T = this.constMul(n).sub(normal.constMul(n + Math.sqrt(1.0 - sinT2))).normalize();
        return Some(T);
    }
}
