class CroquetaException extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class WebGL2NotSupportedException extends CroquetaException {
}

class AssertionErrorException extends CroquetaException {
    constructor(msg) { super(msg); }
}

class NoSuchElementException extends CroquetaException {
}

class MissingParameterException extends CroquetaException {
    constructor(msg) { super(msg); }
}

class ArrayListIterator {
    constructor(list) {
        this.idx = 0;
        this.list = list;
    }
    next() {
        if (!this.hasNext()) {
            throw new NoSuchElementException();
        }
        return this.list[this.idx++];
    }
    hasNext() {
        return this.idx < this.list.length;
    }
}
class ArrayList {
    constructor(...items) {
        this.list = items;
    }
    iterator() {
        return new ArrayListIterator(this.list);
    }
    set(idx, value) {
        this.list[idx] = value;
    }
    get(idx) {
        return this.list[idx];
    }
    pushBack(value) {
        this.list.push(value);
    }
    remove(idx) {
        this.list.splice(idx, 1);
    }
    removeValue(value) {
        let i = this.list.indexOf(value);
        if (i > -1) {
            this.remove(i);
        }
    }
    forEach(f) {
        let it = this.iterator();
        while (it.hasNext()) {
            f(it.next());
        }
    }
}

function assert(cond, msg = "") {
    if (!cond) {
        let m = "Assertion failed: '" + msg + "'";
        console.error(m);
        throw new AssertionErrorException(m);
    }
}

function Some(value) {
    return new SomeImpl(value);
}
function None() {
    return new NoneImpl();
}
function Option(value) {
    if (value === null || typeof value === 'undefined') {
        return None();
    }
    else {
        return Some(value);
    }
}
class SomeImpl {
    constructor(value) {
        this.value = value;
    }
    isEmpty() {
        return false;
    }
    nonEmpty() {
        return true;
    }
    get() {
        return this.value;
    }
    getOrElse(other) {
        return this.value;
    }
    orNull() {
        return this.value;
    }
    orUndefined() {
        return this.value;
    }
    orElse(f) {
        return this;
    }
    forEach(f) {
        f(this.value);
    }
    filter(f) {
        return f(this.value) ? this : None();
    }
    flatMap(f) {
        return f(this.value);
    }
    map(f) {
        return Some(f(this.value));
    }
    toArray() {
        return [this.value];
    }
}
class NoneImpl {
    isEmpty() {
        return true;
    }
    nonEmpty() {
        return false;
    }
    get() {
        throw new NoSuchElementException();
    }
    getOrElse(other) {
        return other();
    }
    orNull() {
        return null;
    }
    orUndefined() {
        return undefined;
    }
    orElse(f) {
        return f();
    }
    forEach(f) {
    }
    filter(f) {
        return this;
    }
    flatMap(f) {
        return None();
    }
    map(f) {
        return None();
    }
    toArray() {
        return [];
    }
}

class Context {
    constructor(parent) {
        this.vars = new Map();
        this.parent = Option(parent);
    }
    get(key) {
        return Option(this.vars.get(key)).orElse(() => this.parent.flatMap((p) => p.get(key)));
    }
    set(key, value) {
        this.vars.set(key, value);
    }
}

function Success(value) {
    return new SuccessImpl(value);
}
function Failure(error) {
    return new FailureImpl(error);
}
function Try(f) {
    try {
        return Success(f());
    }
    catch (error) {
        return Failure(error);
    }
}
class SuccessImpl {
    constructor(value) {
        this.value = value;
    }
    isSuccess() {
        return true;
    }
    isFailure() {
        return false;
    }
    get() {
        return this.value;
    }
    getOrElse(other) {
        return this.value;
    }
    orElse(f) {
        return this;
    }
    fold(f, s) {
        return s(this.value);
    }
    transform(s, f) {
        return s(this.value);
    }
    forEach(f) {
        f(this.value);
    }
    filter(f) {
        return f(this.value) ? this : Failure(new Error());
    }
    flatMap(f) {
        return f(this.value);
    }
    map(f) {
        return Success(f(this.value));
    }
    recover(f) {
        return this;
    }
    recoverWith(f) {
        return this;
    }
    toOption() {
        return Some(this.value);
    }
}
class FailureImpl {
    constructor(error) {
        this.error = error;
    }
    isSuccess() {
        return false;
    }
    isFailure() {
        return true;
    }
    get() {
        throw this.error;
    }
    getOrElse(other) {
        return other();
    }
    orElse(f) {
        return f();
    }
    fold(f, s) {
        return f(this.error);
    }
    transform(s, f) {
        return f(this.error);
    }
    forEach(f) {
    }
    filter(f) {
        return this;
    }
    flatMap(f) {
        return Failure(this.error);
    }
    map(f) {
        return Failure(this.error);
    }
    recover(f) {
        return Try(() => f(this.error));
    }
    recoverWith(f) {
        return f(this.error);
    }
    toOption() {
        return None();
    }
}

class EventManager {
    constructor() {
        this.listeners = new Map();
    }
    addEventListener(eventName, listener) {
        let list = Option(this.listeners.get(eventName)).map((l) => {
            l.pushBack(listener);
            return l;
        }).getOrElse(() => new ArrayList(listener));
        this.listeners.set(eventName, list);
    }
    removeEventListener(eventName, listener) {
        Option(this.listeners.get(eventName)).forEach((listeners) => {
            listeners.removeValue(listener);
        });
    }
    triggerEvent(event) {
        Option(this.listeners.get(event.name)).forEach((listeners) => {
            listeners.forEach(listener => {
                let l = listener;
                l.onEvent(event);
            });
        });
    }
}

class TimeHistory {
    constructor(size) {
        this.deltas = new Array(size).fill(0.001);
        this.idx = 0;
        this.prevTime = performance.now();
    }
    update() {
        let current = performance.now();
        this.deltas[this.idx] = current - this.prevTime;
        this.idx += 1;
        this.idx %= this.deltas.length;
        this.prevTime = current;
    }
    get() {
        var acc = 0;
        this.deltas.forEach(delta => {
            acc += delta;
        });
        return acc / this.deltas.length;
    }
}
class Kernel {
    constructor(eventManager, histSize) {
        this.enabled = false;
        this.eventManager = eventManager;
        this.tasks = new Array();
        this.history = new TimeHistory(histSize);
    }
    addTask(task) {
        this.tasks.push(task);
    }
    start() {
        if (!this.enabled) {
            this.enabled = true;
            window.requestAnimationFrame(() => this.update());
        }
    }
    stop() {
        this.enabled = false;
    }
    update() {
        this.history.update();
        let delta = this.history.get();
        this.tasks.forEach(task => {
            task.update(delta);
        });
        if (this.enabled) {
            window.requestAnimationFrame(() => this.update());
        }
    }
}

class KernelTask {
    constructor(name, applicationContext) {
        this.name = name;
        this.context = applicationContext;
    }
}

class Renderer extends KernelTask {
    constructor(renderingContext, applicationContext, shaderManager) {
        super("renderer", applicationContext);
        this.gl = renderingContext;
        this.shaderManager = shaderManager;
        this.setup(this.gl);
    }
    setup(gl) {
        gl.clearColor(0.2, 0.5, 1.0, 1.0);
    }
    update(delta) {
        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

class ShaderManager {
    constructor(renderingContext) {
        this.gl = renderingContext;
    }
}

class Container {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.eventManager = new EventManager();
    }
    start() {
        this.renderingContext = this.createContext(this.canvasId);
        this.applicationContext = new Context();
        this.shaderManager = new ShaderManager(this.renderingContext);
        this.renderer = new Renderer(this.renderingContext, this.applicationContext, this.shaderManager);
        this.kernel = new Kernel(this.eventManager, 6);
        this.kernel.addTask(this.renderer);
        this.kernel.start();
    }
    shutdown() {
        this.kernel.stop();
    }
    createContext(canvasId) {
        let canvas = document.getElementById(canvasId);
        let gl = canvas.getContext('webgl2');
        return Option(gl).getOrElse(() => { throw new WebGL2NotSupportedException(); });
    }
}

const Epsilon = 0.0001;

class Matrix {
    constructor(matrix, offset = 0) {
        this.m = Option(matrix).map(m => {
            let r = new Array(Matrix.Elements);
            for (let i = 0; i < Matrix.Size; i++) {
                for (let j = 0; j < Matrix.Size; j++) {
                    r[i + j * Matrix.Size] = m[offset + j + i * Matrix.Size];
                }
            }
            return r;
        }).getOrElse(() => new Array(Matrix.Elements).fill(0.0));
    }
    static FromMatrix(m) {
        let r = new Matrix();
        r.copyFrom(m);
        return r;
    }
    clone() {
        let m = new Matrix();
        m.m = this.m.concat();
        return m;
    }
    copyFrom(other) {
        this.m = other.m.concat();
        return this;
    }
    init(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        this.m[0] = n11;
        this.m[1] = n21;
        this.m[2] = n31;
        this.m[3] = n41;
        this.m[4] = n12;
        this.m[5] = n22;
        this.m[6] = n32;
        this.m[7] = n42;
        this.m[8] = n13;
        this.m[9] = n23;
        this.m[10] = n33;
        this.m[11] = n43;
        this.m[12] = n14;
        this.m[13] = n24;
        this.m[14] = n34;
        this.m[15] = n44;
        return this;
    }
    set(row, col, value) {
        this.m[row + col * Matrix.Size] = value;
    }
    get(row, col) {
        return this.m[row + col * Matrix.Size];
    }
    add(other) {
        this.m[0] += other.m[0];
        this.m[1] += other.m[1];
        this.m[2] += other.m[2];
        this.m[3] += other.m[3];
        this.m[4] += other.m[4];
        this.m[5] += other.m[5];
        this.m[6] += other.m[6];
        this.m[7] += other.m[7];
        this.m[8] += other.m[8];
        this.m[9] += other.m[9];
        this.m[10] += other.m[10];
        this.m[11] += other.m[11];
        this.m[12] += other.m[12];
        this.m[13] += other.m[13];
        this.m[14] += other.m[14];
        this.m[15] += other.m[15];
        return this;
    }
    constAdd(other) {
        let r = new Matrix().copyFrom(this);
        return r.add(other);
    }
    sub(other) {
        this.m[0] -= other.m[0];
        this.m[1] -= other.m[1];
        this.m[2] -= other.m[2];
        this.m[3] -= other.m[3];
        this.m[4] -= other.m[4];
        this.m[5] -= other.m[5];
        this.m[6] -= other.m[6];
        this.m[7] -= other.m[7];
        this.m[8] -= other.m[8];
        this.m[9] -= other.m[9];
        this.m[10] -= other.m[10];
        this.m[11] -= other.m[11];
        this.m[12] -= other.m[12];
        this.m[13] -= other.m[13];
        this.m[14] -= other.m[14];
        this.m[15] -= other.m[15];
        return this;
    }
    constSub(other) {
        let r = new Matrix().copyFrom(this);
        return r.sub(other);
    }
    mul(other) {
        return this;
    }
    transpose() {
        this.swap(this.m, 1, this.m, 4);
        this.swap(this.m, 2, this.m, 8);
        this.swap(this.m, 3, this.m, 12);
        this.swap(this.m, 6, this.m, 9);
        this.swap(this.m, 7, this.m, 13);
        this.swap(this.m, 11, this.m, 14);
        return this;
    }
    constTranspose() {
        return new Matrix(this.m);
    }
    swap(a, aIdx, b, bIdx) {
        let tmp = a[aIdx];
        a[aIdx] = b[bIdx];
        b[bIdx] = tmp;
    }
}
Matrix.Elements = 16;
Matrix.Size = 4;

class Coord4D {
    constructor(_x = 0.0, _y = 0.0, _z = 0.0, _w = 0.0) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
    }
    getter(idx) {
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
    setter(idx, value) {
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

class Point extends Coord4D {
    constructor(_x = 0.0, _y = 0.0, _z = 0.0) {
        super(_x, _y, _z, 1.0);
    }
    set(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        return this;
    }
    clone() {
        return new Point(this.x, this.y, this.z);
    }
    copyFrom(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    constAdd(v) {
        return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    constSub(v) {
        return new Point(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    constMul(n) {
        return new Point(this.x * n, this.y * n, this.z * n);
    }
    div(n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
    constDiv(n) {
        return new Point(this.x / n, this.y / n, this.z / n);
    }
}

class Ray {
    constructor(point, direction, tMin = Ray.defaultMinT, tMax = Ray.defaultMaxT) {
        this.o = point.clone();
        this.d = direction.clone();
        this.minT = tMin;
        this.maxT = tMax;
    }
    clone() {
        return new Ray(this.o, this.d, this.minT, this.maxT);
    }
    copyFrom(other) {
        this.o.copyFrom(other.o);
        this.d.copyFrom(other.d);
        this.minT = other.minT;
        this.maxT = other.maxT;
        return this;
    }
    solve(t) {
        return this.o.constAdd(this.d.constMul(t));
    }
}
Ray.defaultMinT = Epsilon;
Ray.defaultMaxT = Number.MAX_VALUE;

class Vector extends Coord4D {
    constructor(_x = 0.0, _y = 0.0, _z = 0.0) {
        super(_x, _y, _z, 0.0);
    }
    static FromPoints(p1, p0) {
        return new Vector(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
    }
    set(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        return this;
    }
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    copyFrom(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    constAdd(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    constSub(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    constMul(n) {
        return new Vector(this.x * n, this.y * n, this.z * n);
    }
    div(n) {
        let inv = 1.0 / n;
        this.x *= inv;
        this.y *= inv;
        this.z *= inv;
        return this;
    }
    constDiv(n) {
        let inv = 1.0 / n;
        return new Vector(this.x * inv, this.y * n, this.z * n);
    }
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    constNeg() {
        return new Vector(-this.x, -this.y, -this.z);
    }
    normalize() {
        return this.div(this.length());
    }
    constNormalize() {
        return this.constDiv(this.length());
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
        return Math.sqrt(this.lengthSq());
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        let vx = this.y * v.z - this.z * v.y;
        let vy = this.z * v.x - this.x * v.z;
        let vz = this.x * v.y - this.y * v.x;
        this.x = vx;
        this.y = vy;
        this.z = vz;
        return this;
    }
    constCross(v) {
        let vx = this.y * v.z - this.z * v.y;
        let vy = this.z * v.x - this.x * v.z;
        let vz = this.x * v.y - this.y * v.x;
        return new Vector(vx, vy, vz);
    }
    reflect(normal) {
        let tmp = this.constReflect(normal);
        return this.copyFrom(tmp);
    }
    constReflect(normal) {
        return normal.constMul(2 * normal.dot(this)).sub(this);
    }
    constRefract(normal, n1, n2) {
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

const VersionMajor = 0;
const VersionMinor = 0;
const VersionRev = 1;
const VersionDev = true;
const Version = "" + VersionMajor + "." + VersionMinor + "." + VersionRev + (VersionDev ? "-dev" : "");
console.log("croqueta " + Version);

export { VersionMajor, VersionMinor, VersionRev, VersionDev, Version, ArrayList, assert, Context, CroquetaException, WebGL2NotSupportedException, AssertionErrorException, NoSuchElementException, MissingParameterException, Some, None, Option, Success, Failure, Try, Container, Epsilon, Matrix, Point, Ray, Vector };
