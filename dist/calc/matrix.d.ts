import Vector from "./vector";
/** 非正則行列エラー */
export declare class SingularMatrixError extends Error {
    constructor(message: string);
}
declare class Matrix {
    values: number[][];
    dimention: number[];
    constructor(values: number[][]);
    toArray(): number[][];
    toString(): string;
    copy(): Matrix;
    splice(direction: "row" | "col" | 0 | 1, start?: number, end?: number, values?: number[][]): Matrix;
    ope(operator: "+" | "-" | "*" | "/", val: number | Matrix): Matrix;
    slice(startRow?: number, startCol?: number, endRow?: number, endCol?: number): Matrix;
    row(index: number): Vector;
    col(index: number): Vector;
    rows(start?: number, end?: number): Vector[];
    cols(start?: number, end?: number): Vector[];
    transpose(): Matrix;
    T(): Matrix;
    static zeros(row: number, col?: number): Matrix;
    static ones(row: number, col?: number): Matrix;
    static eye(row: number, col?: number, pos?: number): Matrix;
    static isMatrix(obj: any): boolean;
    static hstack(...mats: Matrix[]): Matrix;
    static vstack(...mats: Matrix[]): Matrix;
    product(val: Matrix | Vector): Vector | Matrix;
    inv(e?: number): Matrix;
    det(e?: number): number;
    isNonSingular(e?: number): boolean;
}
export default Matrix;
