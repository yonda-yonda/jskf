interface Options {
    maxIteration?: number;
    eps?: number;
}
export declare function minimize(f: Function, x0: number[], options?: Options): [number[], number, number, boolean];
export {};
