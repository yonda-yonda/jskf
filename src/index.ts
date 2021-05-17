import Linear from "./linear/index";
import { range as utilsRange } from "./utils";
export * as calc from "./calc/index";
export * as plot from "./plot";
export * as opt from "./opt";
export { Linear };
export const range = (...args: number[]): number[] => {
  return Array.from(utilsRange(...args));
};
