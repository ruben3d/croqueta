import { Epsilon } from "./math";
import { Point } from "./Point";
import { Vector } from "./Vector";
import { Cloneable } from "../base/Cloneable";
import { Copyable } from "../base/Copyable";

export class Ray implements Cloneable<Ray>, Copyable<Ray> {

    static readonly defaultMinT = Epsilon;
    static readonly defaultMaxT = Number.MAX_VALUE;

    o: Point;
    d: Vector;

    minT: number;
    maxT: number;

    constructor(point: Point, direction: Vector, tMin: number = Ray.defaultMinT, tMax: number = Ray.defaultMaxT) {
        this.o = point.clone();
        this.d = direction.clone();
        this.minT = tMin;
        this.maxT = tMax;
    }

    clone(): Ray {
        return new Ray(this.o, this.d, this.minT, this.maxT);
    }

    copyFrom(other: Ray): Ray {
        this.o.copyFrom(other.o);
        this.d.copyFrom(other.d);
        this.minT = other.minT;
        this.maxT = other.maxT;
        return this;
    }

    solve(t: number): Point {
        return this.o.constAdd(this.d.constMul(t));
    }
}
