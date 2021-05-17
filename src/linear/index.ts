import { Vector, Matrix, sum, products } from "../calc/index";

export type stateType = "estimated" | "filtered" | "smoothed";
const isStateType = (arg: any): arg is stateType =>
  ["estimated", "filtered", "smoothed"].includes(arg);
type yType = number[] | number | null;

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

class Linear {
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
  #observed: (Vector | null)[];
  #state: {
    estimated: {
      x: Vector[];
      cov: Matrix[];
    };
    filtered: {
      x: Vector[];
      cov: Matrix[];
    };
    smoothed: {
      x: Vector[];
      cov: Matrix[];
      last: number;
    };
    forecasted: {
      x: Vector[];
      cov: Matrix[];
      last: {
        start: number;
        end: number;
      };
    };
  };

  constructor(props: LinearProps) {
    this.F = Array.isArray(props.F)
      ? new Matrix(props.F)
      : new Matrix([[props.F]]);
    this.G = Array.isArray(props.G)
      ? new Matrix(props.G)
      : new Matrix([[props.G]]);
    this.H = Array.isArray(props.H)
      ? new Matrix(props.H)
      : new Matrix([[props.H]]);
    this.Q = Array.isArray(props.Q)
      ? new Matrix(props.Q)
      : new Matrix([[props.Q]]);
    this.R = Array.isArray(props.R)
      ? new Matrix(props.R)
      : new Matrix([[props.R]]);

    const x_size = this.F.dimention[0];
    const y_size = this.H.dimention[0];

    if (this.F.dimention[0] !== this.F.dimention[1])
      throw new TypeError(`F must be square matrix.`);
    if (this.G.dimention[0] !== x_size)
      throw new TypeError(`G row must be equal to x dim.`);
    if (this.G.dimention[1] !== this.Q.dimention[0])
      throw new TypeError(`G col must be equal to Q row.`);
    if (this.Q.dimention[0] !== this.Q.dimention[1])
      throw new TypeError(`Q must must be square matrix.`);
    if (this.H.dimention[1] !== x_size)
      throw new TypeError(`H col must be equal to x dim.`);
    if (this.R.dimention[0] !== this.R.dimention[1])
      throw new TypeError(`R must must be square matrix.`);
    if (this.R.dimention[0] !== y_size)
      throw new TypeError(`R row must be equal to y dim.`);

    let x0, cov0;
    if (props?.init?.x) {
      if (Array.isArray(props.init.x)) x0 = new Vector(props.init.x);
      else x0 = new Vector([props.init.x]);
    } else {
      x0 = Vector.zeros(x_size);
    }
    if (props?.init?.cov) {
      if (Array.isArray(props.init.cov)) cov0 = new Matrix(props.init.cov);
      else cov0 = new Matrix([[props.init.cov]]);
    } else {
      cov0 = Matrix.eye(x_size).ope("*", 10000000);
    }
    const init = {
      x: x0,
      cov: cov0,
    };
    if (init.x.values.length !== x_size)
      throw new TypeError(`size of init x must be equal to x dim.`);
    if (init.cov.dimention[0] !== init.cov.dimention[1])
      throw new TypeError(`init cov must be square matrix.`);
    if (init.cov.dimention[0] !== x_size)
      throw new TypeError(`size of init cov must be equal to x dim.`);

    this._GQGT = products(this.G, this.Q, this.G.T()) as Matrix;
    this._FT = this.F.T();
    this._HT = this.H.T();

    this.size = {
      x: x_size,
      y: y_size,
    };
    this.init = init;
    this.#observed = [];
    this.#state = {
      estimated: {
        x: [],
        cov: [],
      },
      filtered: {
        x: [],
        cov: [],
      },
      smoothed: {
        x: [],
        cov: [],
        last: 0,
      },
      forecasted: {
        x: [],
        cov: [],
        last: {
          start: 0,
          end: 0,
        },
      },
    };

    if (props.y) {
      props.y.forEach((y) => {
        this.update(y);
      });
    }
  }

  current() {
    return this.#observed.length;
  }

  private estimate() {
    const current = this.current();
    const x_prev =
      current < 2 ? this.init.x : this.#state.filtered.x[current - 2];
    const cov_prev =
      current < 2 ? this.init.cov : this.#state.filtered.cov[current - 2];

    const x = this.F.product(x_prev) as Vector;
    const cov = (products(this.F, cov_prev, this._FT) as Matrix).ope(
      "+",
      this._GQGT
    );
    this.#state.estimated.x.push(x);
    this.#state.estimated.cov.push(cov);
  }

  private filtering(observed: Vector | null) {
    const current = this.current();
    const x_prev = this.#state.estimated.x[current - 1];
    const cov_prev = this.#state.estimated.cov[current - 1];
    if (observed) {
      const K = products(
        cov_prev,
        this._HT,
        (products(this.H, cov_prev, this._HT) as Matrix).ope("+", this.R).inv()
      );
      const x = sum(
        this.F.product(x_prev) as Vector,
        K.product(observed.ope("-", this.H.product(x_prev) as Vector))
      ) as Vector;
      const cov = cov_prev.ope("-", products(K, this.H, cov_prev) as Matrix);
      this.#state.filtered.x.push(x);
      this.#state.filtered.cov.push(cov);
    } else {
      this.#state.filtered.x.push(x_prev);
      this.#state.filtered.cov.push(cov_prev);
    }
  }

  private smooth() {
    const current = this.current();
    if (this.#state.smoothed.last === current) return;

    this.#state.smoothed.last = current;
    this.#state.smoothed.x = [];
    this.#state.smoothed.cov = [];

    this.#state.smoothed.x[current - 1] = this.#state.filtered.x[current - 1];
    this.#state.smoothed.cov[current - 1] =
      this.#state.filtered.cov[current - 1];
    for (let i = current - 1; i > 0; i--) {
      const x_prev = this.#state.smoothed.x[i];
      const cov_prev = this.#state.smoothed.cov[i];
      const filteredX = this.#state.filtered.x[i - 1];
      const estimatedX = this.#state.estimated.x[i];
      const filteredCov = this.#state.filtered.cov[i - 1];
      const estimatedCov = this.#state.estimated.cov[i];

      const C = filteredCov
        .product(this._FT)
        .product(estimatedCov.inv()) as Matrix;
      const x = filteredX.ope(
        "+",
        C.product(x_prev.ope("-", estimatedX)) as Vector
      );
      const cov = filteredCov.ope(
        "+",
        products(C, cov_prev.ope("-", estimatedCov), C.T()) as Matrix
      );
      this.#state.smoothed.x[i - 1] = x;
      this.#state.smoothed.cov[i - 1] = cov;
    }
  }

  private forecast(end: number) {
    const current = this.current();
    if (end <= current) return;
    let start;
    if (this.#state.forecasted.last.start < current) {
      this.#state.forecasted.last.start = current;
      this.#state.forecasted.x = [];
      this.#state.forecasted.cov = [];
      start = current;
    } else {
      if (this.#state.forecasted.last.end >= end) return;
      start = this.#state.forecasted.last.end;
    }
    this.#state.forecasted.last.end = end;
    let x_prev, cov_prev;
    if (start === current) {
      if (current < 2) {
        x_prev = this.init.x;
        cov_prev = this.init.cov;
      } else {
        x_prev = this.#state.filtered.x[current - 1];
        cov_prev = this.#state.filtered.cov[current - 1];
      }
    } else {
      x_prev = this.#state.forecasted.x[start - current - 1];
      cov_prev = this.#state.forecasted.cov[start - current - 1];
    }
    for (let i = start; i < end; i++) {
      const x = this.F.product(x_prev) as Vector;
      const cov = (products(this.F, cov_prev, this._FT) as Matrix).ope(
        "+",
        this._GQGT
      ) as Matrix;
      this.#state.forecasted.x.push(x);
      this.#state.forecasted.cov.push(cov);
      x_prev = x;
      cov_prev = cov;
    }
  }

  update(y?: yType) {
    const observed = Array.isArray(y)
      ? new Vector(y)
      : typeof y === "number"
      ? new Vector([y])
      : null;
    if (observed && observed.values.length !== this.size.y)
      throw new TypeError(`y dim doesn't match.`);

    this.#observed.push(observed);
    this.estimate();
    this.filtering(observed);
  }

  y(props?: range & row): (number[] | number | null)[] {
    const { start, end, index } = Object.assign({}, props);
    const observed = this.#observed;
    let startIndex = typeof start === "number" ? start : 0;
    let endIndex = typeof end === "number" ? end : this.current();
    if (startIndex < 0) startIndex = 0;
    if (endIndex > this.current()) endIndex = this.current();
    if (endIndex <= startIndex) return [];

    let selectIndex = -1;
    if (typeof index === "number") {
      if (index < 0) selectIndex = 0;
      else if (index >= this.size.y) selectIndex = this.size.y - 1;
      else selectIndex = index;
    }
    const ret = [];

    for (let i = startIndex; i < endIndex; i++) {
      const item = observed[i];

      if (Vector.isVector(item)) {
        const arr = (item as Vector).toArray();
        if (selectIndex < 0) ret.push(arr);
        else ret.push(arr[selectIndex]);
      } else {
        ret.push(null);
      }
    }
    return ret;
  }

  x(props?: range & state & row): (number[] | number)[] {
    const { start, end, type, index } = Object.assign({}, props);
    const current = this.current();
    const stateType = isStateType(type) ? type : "filtered";
    let startIndex = typeof start !== "undefined" ? start : 0;
    let endIndex = typeof end !== "undefined" ? end : current;
    if (startIndex < 0) startIndex = 0;
    if (endIndex <= startIndex) return [];
    if (type === "smoothed") {
      this.smooth();
    }
    const state = this.#state[stateType].x;

    let selectIndex = -1;
    if (typeof index === "number") {
      if (index < 0) selectIndex = 0;
      else if (index >= this.size.x) selectIndex = this.size.x - 1;
      else selectIndex = index;
    }
    const ret = [];
    const loopLength = current < endIndex ? current : endIndex;
    for (let i = startIndex; i < loopLength; i++) {
      const arr = (state[i] as Vector).toArray();
      if (selectIndex < 0) ret.push(arr);
      else ret.push(arr[selectIndex]);
    }

    if (current < endIndex) {
      this.forecast(endIndex);
      this.#state.forecasted.x.slice(0, endIndex - current).forEach((v) => {
        ret.push(v.toArray());
      });
    }
    return ret;
  }

  cov(props?: range & state & mat): (number[][] | number)[] {
    const { start, end, type, index } = Object.assign({}, props);
    const current = this.current();
    const stateType = type ? type : "filtered";
    let startIndex = typeof start === "number" ? start : 0;
    let endIndex = typeof end === "number" ? end : current;
    if (startIndex < 0) startIndex = 0;
    if (endIndex < startIndex) endIndex = startIndex;

    if (type === "smoothed") {
      this.smooth();
    }
    const cov = this.#state[stateType].cov;

    let selectRow = -1,
      selectCol = -1;
    if (typeof index === "number") {
      if (index < 0) {
        selectRow = 0;
        selectCol = 0;
      } else if (index >= this.size.x) {
        selectRow = this.size.x - 1;
        selectCol = this.size.x - 1;
      } else {
        selectRow = index;
        selectCol = index;
      }
    } else if (Array.isArray(index)) {
      const [row, col] = index;
      if (typeof row === "number") {
        if (row < 0) selectRow = 0;
        else if (row >= this.size.x) selectRow = this.size.x - 1;
        else selectRow = row;
      }
      if (typeof col === "number") {
        if (col < 0) selectCol = 0;
        else if (col >= this.size.x) selectCol = this.size.x - 1;
        else selectCol = col;
      }
    }
    const ret = [];
    const loopLength = current < endIndex ? current : endIndex;
    for (let i = startIndex; i < loopLength; i++) {
      const item = cov[i];
      const arr = (item as Matrix).toArray();
      if (selectRow < 0 || selectCol < 0) ret.push(arr);
      else ret.push(arr[selectRow][selectCol]);
    }
    if (current < endIndex) {
      this.forecast(endIndex);
      this.#state.forecasted.cov.slice(0, endIndex - current).forEach((v) => {
        ret.push(v.toArray());
      });
    }
    return ret;
  }

  likelihood(): number {
    const xs = this.#state.estimated.x;
    const covs = this.#state.estimated.cov;
    const ys = this.#observed;
    const current = this.current();
    let ret = 0;
    for (let i = 0; i < current; i++) {
      const F = sum(this.R, products(this.H, covs[i], this._HT)) as Matrix;
      const d = (ys[i] as Vector).ope("-", products(this.H, xs[i]) as Vector);
      ret +=
        Math.log(F.det()) + (products(d, F.inv(), d) as Matrix).values[0][0];
    }
    return -0.5 * ret;
  }
}

export default Linear;
