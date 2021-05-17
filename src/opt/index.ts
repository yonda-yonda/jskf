import { nelderMead } from "./nelder-mead";

interface Options {
  maxIteration?: number;
  eps?: number;
}
export function minimize(f: Function, x0: number[], options?: Options) {
  return nelderMead(f, x0, options);
}
