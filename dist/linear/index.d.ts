import { Vector, Matrix } from "../calc/index";
export declare type stateType = "estimated" | "filtered" | "smoothed";
declare type yType = number[] | number | null;
interface LinearProps {
    init?: {
        x?: number[] | number;
        cov?: number[][] | number;
    };
    y?: yType[];
    F: number[][] | number;
    G: number[][] | number;
    H: number[][] | number;
    Q: number[][] | number;
    R: number[][] | number;
}
interface range {
    start?: number;
    end?: number;
}
interface state {
    type?: stateType;
}
interface row {
    index?: number;
}
interface mat {
    index?: number | [number, number];
}
declare class Linear {
    #private;
    readonly F: Matrix;
    readonly G: Matrix;
    readonly H: Matrix;
    readonly Q: Matrix;
    readonly R: Matrix;
    readonly _GQGT: Matrix;
    readonly _FT: Matrix;
    readonly _HT: Matrix;
    readonly size: {
        x: number;
        y: number;
    };
    readonly init: {
        x: Vector;
        cov: Matrix;
    };
    constructor(props: LinearProps);
    current(): number;
    private estimate;
    private filtering;
    private smooth;
    private forecast;
    update(y?: yType): void;
    y(props?: range & row): (number[] | number | null)[];
    x(props?: range & state & row): (number[] | number)[];
    cov(props?: range & state & mat): (number[][] | number)[];
    likelihood(): number;
}
export default Linear;
