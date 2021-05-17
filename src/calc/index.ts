import Vector from "./vector";
import Matrix from "./matrix";

export { Vector, Matrix };

export function sum(...args: (Vector | Matrix)[]): Vector | Matrix {
  if (args.length < 1) throw new Error("Nothing arguments.");
  let ret: Vector | Matrix;
  ret = args[0].copy();

  const values = args.slice(1);

  values.forEach((v: any) => {
    if (v.constructor.name !== ret.constructor.name)
      throw new Error("Don't match arguments class.");
    ret = ret.ope("+", v);
  });
  return ret;
}

export function products(...args: (Vector | Matrix)[]): Vector | Matrix {
  if (args.length < 1) throw new Error("Nothing arguments.");
  let ret: Vector | Matrix = args[0].copy();
  const values = args.slice(1);

  values.forEach((v: any) => {
    ret = ret.product(v);
  });
  return ret;
}
