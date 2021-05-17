import Matrix from "./matrix";

class Vector {
  values: number[];

  constructor(values: number[]) {
    this.values = values.slice();
  }

  forEach(
    callback: (v: number, i: number, target: Vector) => void,
    thisArg?: any
  ) {
    for (let i = 0; i < this.values.length; i++) {
      callback.call(thisArg, this.values[i], i, this);
    }
  }

  toArray(): number[] {
    return this.values.slice();
  }

  toString(): string {
    let message = "[";
    this.forEach((value: number, index: number) => {
      message += value;
      if (index !== this.values.length - 1) message += ", ";
    });
    return message + "]";
  }

  toMatrix(direction?: "row" | "col" | 0 | 1): Matrix {
    let directionIndex = 0;

    if (direction === "col" || direction === 1) {
      directionIndex = 1;
    }

    if (directionIndex === 0) {
      const mat: number[][] = [];
      this.forEach((v) => {
        mat.push([v]);
      });
      return new Matrix(mat);
    }
    return new Matrix([this.toArray()]);
  }

  copy(): Vector {
    return new Vector(this.toArray());
  }

  slice(...args: number[]): Vector {
    const arr = this.values.slice(...args);
    return new Vector(arr);
  }

  splice(...args: number[]): Vector {
    /**
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
     *     破壊的操作を行う。
     */
    const start = args[0];
    const deleteCount = args?.length > 1 ? args[1] : this.values.length - start;
    const addValues = args?.length > 2 ? args.slice(2) : [];
    const removed =
      args.length > 0
        ? this.values.splice(start, deleteCount, ...addValues)
        : [];
    return new Vector(removed);
  }

  unshift(value: number): number {
    this.values.splice(0, 0, value);
    return this.values.length;
  }

  shift(): number | undefined {
    return this.values.splice(0, 1)[0];
  }

  push(value: number): number {
    this.splice(this.values.length, 0, value);
    return this.values.length;
  }

  pop(): number | undefined {
    return this.values.splice(-1, 1)[0];
  }

  ope(operator: "+" | "-" | "*" | "/", val: number | Vector): Vector {
    let arr = this.toArray();

    if (typeof val === "number")
      for (let i = 0; i < arr.length; i++) {
        switch (operator) {
          case "+":
            arr[i] += val;
            break;
          case "-":
            arr[i] -= val;
            break;
          case "*":
            arr[i] *= val;
            break;
          case "/":
            arr[i] /= val;
            break;
        }
      }
    else {
      if (this.values.length !== val.values.length) {
        throw new TypeError(`don\'t match Vector size.`);
      }
      for (let i = 0; i < arr.length; i++) {
        switch (operator) {
          case "+":
            arr[i] += val.values[i];
            break;
          case "-":
            arr[i] -= val.values[i];
            break;
          case "*":
            arr[i] *= val.values[i];
            break;
          case "/":
            arr[i] /= val.values[i];
            break;
        }
      }
    }
    return new Vector(arr);
  }

  norm(): number {
    let norm2 = 0;
    for (let i = 0; i < this.values.length; i++) {
      norm2 += this.values[i] ** 2;
    }
    return Math.sqrt(norm2);
  }

  mean(): number {
    return (
      this.values.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      ) / this.values.length
    );
  }

  var(): number {
    const mean = this.mean();
    let ret = this.copy().ope("-", mean);
    ret = ret.ope("*", ret);

    return ret.mean();
  }

  unit(): Vector {
    return this.copy().ope("/", this.norm());
  }

  reverse(): Vector {
    return new Vector(this.toArray().reverse());
  }

  concat(...vectors: Vector[]): Vector {
    vectors.forEach((vector, index) => {
      if (!Vector.isVector(vector)) {
        throw new TypeError(`the ${index}-th argument is not vector.`);
      }
    });
    const arr = this.toArray();
    for (let vec of vectors) {
      arr.splice(arr.length, 0, ...vec.toArray());
    }
    return new Vector(arr);
  }

  cross(vec: Vector): Vector {
    if (this.values.length !== 3)
      throw new TypeError(`this vector is not 3-dim.`);
    if (vec.values.length !== 3)
      throw new TypeError(`the argument is not Vector(3-dim).`);
    const vec1 = this;
    const vec2 = vec;

    let arr = [
      vec1.values[1] * vec2.values[2] - vec1.values[2] * vec2.values[1],
      vec1.values[2] * vec2.values[0] - vec1.values[0] * vec2.values[2],
      vec1.values[0] * vec2.values[1] - vec1.values[1] * vec2.values[0],
    ];
    return new Vector(arr);
  }

  dot(val: Vector): number {
    const vec = val as Vector;
    if (this.values.length !== vec.values.length) {
      throw new TypeError(`don\'t match Vector size.`);
    }
    let result = 0;
    for (let i = 0; i < this.values.length; i++) {
      result += this.values[i] * vec.values[i];
    }
    return result;
  }

  product(val: Matrix | Vector): Vector | Matrix {
    if (Vector.isVector(val)) {
      const vec = val as Vector;
      if (this.values.length !== vec.values.length) {
        throw new TypeError(`don\'t match Vector size.`);
      }
      const result: number[][] = [];
      this.forEach((v) => {
        result.push(vec.ope("*", v).toArray());
      });
      return new Matrix(result);
    } else {
      const mat = val as Matrix;
      if (this.values.length !== mat.dimention[0]) {
        throw new TypeError(`don\'t match dimentions.`);
      }
      const result: number[] = [];
      mat.cols().forEach((col) => {
        result.push(this.dot(col) as number);
      });
      return new Vector(result);
    }
  }

  static zeros(len: number): Vector {
    const length = Math.floor(len);
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(0);
    }
    return new Vector(arr);
  }

  static ones(len: number): Vector {
    return Vector.zeros(len).ope("+", 1);
  }

  static range(...args: number[]) {
    /**
     *   numpy.rangeを参考している。
     */
    const arr = [];
    const startNum = args.length >= 2 ? args[0] : 0,
      stopNum = args.length >= 2 ? args[1] : args[0],
      stepNum = args.length > 2 ? args[2] : 1;
    if (stepNum === 0) {
      throw new TypeError(`step must not be zero.`);
    }
    if (stepNum > 0) {
      for (let i = startNum; i < stopNum; i += stepNum) {
        arr.push(i);
      }
    } else {
      for (let i = startNum; i > stopNum; i += stepNum) {
        arr.push(i);
      }
    }

    return new Vector(arr);
  }

  static isVector(obj: any): boolean {
    return obj instanceof Vector;
  }
}

export default Vector;
