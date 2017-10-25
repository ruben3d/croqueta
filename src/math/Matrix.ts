
import { Cloneable } from "../base/Cloneable";
import { Copyable } from "../base/Copyable";
import { Option } from "../base/Option";

export class Matrix implements Cloneable<Matrix>, Copyable<Matrix> {
    static readonly Elements = 16;
    static readonly Size = 4;

    private m: number[];

    /**
     * Creates an instance of Matrix. All elements are 0.
     * @memberof Matrix
     */
    constructor();

    /**
     * Creates an instance of Matrix.
     * @param {number[]} [matrix] Row after row (row-major)
     * @memberof Matrix
     */
    constructor(matrix?: number[]);

    /**
     * Creates an instance of Matrix.
     * @param {number[]} [matrix] Row after row (row-major)
     * @param {number} [offset=0] 
     * @memberof Matrix
     */
    constructor(matrix?: number[], offset: number = 0) {
        this.m = Option(matrix).map(m => {
            let r = new Array<number>(Matrix.Elements);
            for (let i = 0; i < Matrix.Size; i++) {
                for (let j = 0; j < Matrix.Size; j++) {
                    r[i + j * Matrix.Size] = m[offset + j + i * Matrix.Size];
                }
            }
            return r;
        }).getOrElse(() => new Array(Matrix.Elements).fill(0.0));
    }

    static FromMatrix(m: Matrix): Matrix {
        let r = new Matrix();
        r.copyFrom(m);
        return r;
    }

    clone(): Matrix {
        let m = new Matrix();
        m.m = this.m.concat();
        return m;
    }

    copyFrom(other: Matrix): Matrix {
        this.m = other.m.concat();
        return this;
    }

    init(n11: number, n12: number, n13: number, n14: number,    // 1st row
        n21: number, n22: number, n23: number, n24: number,     // 2nd row
        n31: number, n32: number, n33: number, n34: number,     // 3rd row
        n41: number, n42: number, n43: number, n44: number)     // 4th row
        : Matrix {

        this.m[0] = n11;    // 1st col
        this.m[1] = n21;
        this.m[2] = n31;
        this.m[3] = n41;
        this.m[4] = n12;    // 2nd col
        this.m[5] = n22;
        this.m[6] = n32;
        this.m[7] = n42;
        this.m[8] = n13;    // 3rd col
        this.m[9] = n23;
        this.m[10] = n33;
        this.m[11] = n43;
        this.m[12] = n14;   // 4th col
        this.m[13] = n24;
        this.m[14] = n34;
        this.m[15] = n44;
        return this;
    }

    set(row: number, col: number, value: number): void {
        this.m[row + col * Matrix.Size] = value;
    }

    get(row: number, col: number): number {
        return this.m[row + col * Matrix.Size];
    }

    add(other: Matrix): Matrix {
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

    constAdd(other: Matrix): Matrix {
        let r = new Matrix().copyFrom(this);
        return r.add(other);
    }

    sub(other: Matrix): Matrix {
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

    constSub(other: Matrix): Matrix {
        let r = new Matrix().copyFrom(this);
        return r.sub(other);
    }

    mul(other: Matrix): Matrix {
        let n0 = this.m[0];
        let n1 = this.m[1];
        let n2 = this.m[2];
        let n3 = this.m[3];
        let n4 = this.m[4];
        let n5 = this.m[5];
        let n6 = this.m[6];
        let n7 = this.m[7];
        let n8 = this.m[8];
        let n9 = this.m[9];
        let n10 = this.m[10];
        let n11 = this.m[11];
        let n12 = this.m[12];
        let n13 = this.m[13];
        let n14 = this.m[14];
        let n15 = this.m[15];
        this.m[0]  = n0 * other.m[0]  + n4 * other.m[1]  + n8  * other.m[2]  + n12 * other.m[3];  // 1st column
        this.m[1]  = n1 * other.m[0]  + n5 * other.m[1]  + n9  * other.m[2]  + n13 * other.m[3];
        this.m[2]  = n2 * other.m[0]  + n6 * other.m[1]  + n10 * other.m[2]  + n14 * other.m[3];
        this.m[3]  = n3 * other.m[0]  + n7 * other.m[1]  + n11 * other.m[2]  + n15 * other.m[3];
        this.m[4]  = n0 * other.m[4]  + n4 * other.m[5]  + n8  * other.m[6]  + n12 * other.m[7];  // 2nd column
        this.m[5]  = n1 * other.m[4]  + n5 * other.m[5]  + n9  * other.m[6]  + n13 * other.m[7];
        this.m[6]  = n2 * other.m[4]  + n6 * other.m[5]  + n10 * other.m[6]  + n14 * other.m[7];
        this.m[7]  = n3 * other.m[4]  + n7 * other.m[5]  + n11 * other.m[6]  + n15 * other.m[7];
        this.m[8]  = n0 * other.m[8]  + n4 * other.m[9]  + n8  * other.m[10] + n12 * other.m[11];  // 3rd column
        this.m[9]  = n1 * other.m[8]  + n5 * other.m[9]  + n9  * other.m[10] + n13 * other.m[11];
        this.m[10] = n2 * other.m[8]  + n6 * other.m[9]  + n10 * other.m[10] + n14 * other.m[11];
        this.m[11] = n3 * other.m[8]  + n7 * other.m[9]  + n11 * other.m[10] + n15 * other.m[11];
        this.m[12] = n0 * other.m[12] + n4 * other.m[13] + n8  * other.m[14] + n12 * other.m[15]; // 4th column
        this.m[13] = n1 * other.m[12] + n5 * other.m[13] + n9  * other.m[14] + n13 * other.m[15];
        this.m[14] = n2 * other.m[12] + n6 * other.m[13] + n10 * other.m[14] + n14 * other.m[15];
        this.m[15] = n3 * other.m[12] + n7 * other.m[13] + n11 * other.m[14] + n15 * other.m[15];
        return this;
    }

    consMul(other: Matrix): Matrix {
        let r = new Matrix().copyFrom(this);
        return r.mul(other);
    }

    transpose(): Matrix {
        this.swap(this.m, 1, this.m, 4);
        this.swap(this.m, 2, this.m, 8);
        this.swap(this.m, 3, this.m, 12);
        this.swap(this.m, 6, this.m, 9);
        this.swap(this.m, 7, this.m, 13);
        this.swap(this.m, 11, this.m, 14);
        return this;
    }

    constTranspose(): Matrix {
        return new Matrix(this.m);
    }

    private swap(a: number[], aIdx: number, b: number[], bIdx: number): void {
        let tmp = a[aIdx];
        a[aIdx] = b[bIdx];
        b[bIdx] = tmp;
    }
}
