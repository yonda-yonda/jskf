export declare function zip<T extends Array<any>>(...args: {
    [K in keyof T]: Iterable<T[K]>;
}): Generator<T>;
export declare function range(...args: number[]): Generator<number>;
