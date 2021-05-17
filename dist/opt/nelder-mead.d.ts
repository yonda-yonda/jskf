interface Options {
    maxIteration?: number;
    eps?: number;
}
export declare const nelderMead: (f: Function, x0: number[], options?: Options | undefined) => [number[], number, number, boolean];
export {};
