import Linear, { stateType } from "./linear";
interface plotOptions {
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    width?: number;
    height?: number;
    resize?: boolean;
    observed?: number[];
    state?: number[];
    variance?: boolean;
    type?: stateType;
    start?: number;
    end?: number;
    min?: number;
    max?: number;
    ticks?: (string | number | null)[];
    unit?: string;
    colors?: string[];
}
export declare const show: (kalmanfilter: Linear, elm: HTMLElement, options: plotOptions) => void;
export {};
