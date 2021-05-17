import Vector from "./vector";
import Matrix from "./matrix";
export { Vector, Matrix };
export declare function sum(...args: (Vector | Matrix)[]): Vector | Matrix;
export declare function products(...args: (Vector | Matrix)[]): Vector | Matrix;
