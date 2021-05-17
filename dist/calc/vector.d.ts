import Matrix from "./matrix";
declare class Vector {
    values: number[];
    constructor(values: number[]);
    forEach(callback: (v: number, i: number, target: Vector) => void, thisArg?: any): void;
    toArray(): number[];
    toString(): string;
    toMatrix(direction?: "row" | "col" | 0 | 1): Matrix;
    copy(): Vector;
    slice(...args: number[]): Vector;
    splice(...args: number[]): Vector;
    unshift(value: number): number;
    shift(): number | undefined;
    push(value: number): number;
    pop(): number | undefined;
    ope(operator: "+" | "-" | "*" | "/", val: number | Vector): Vector;
    norm(): number;
    mean(): number;
    var(): number;
    unit(): Vector;
    reverse(): Vector;
    concat(...vectors: Vector[]): Vector;
    cross(vec: Vector): Vector;
    dot(val: Vector): number;
    product(val: Matrix | Vector): Vector | Matrix;
    static zeros(len: number): Vector;
    static ones(len: number): Vector;
    static range(...args: number[]): Vector;
    static isVector(obj: any): boolean;
}
export default Vector;
