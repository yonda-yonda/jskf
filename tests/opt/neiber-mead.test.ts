import { nelderMead } from "../../src/opt/nelder-mead";
const eps = 1e-8;

describe("Nelder-mead method", function () {
  it("Rosenbrock Banana function", function () {
    const f = (x: number[]) => {
      return (1 - x[0]) ** 2 + 100 * (x[1] - x[0] ** 2) ** 2;
    };
    const x0 = [0, 0];
    const [x, fmin, iter, success] = nelderMead(f, x0);
    expect(success).toBe(true);
    x.forEach((v) => {
      expect(Math.abs(v - 1) < eps).toBe(true);
    });
    expect(Math.abs(fmin - 0) < eps).toBe(true);
  });
  it("x' length", function () {
    const f = (x: number[]) => {
      let ret = 0;
      x.forEach((v) => {
        ret += v ** 2;
      });
      return ret;
    };
    for (let i = 1; i <= 10; i++) {
      const x0 = [];
      for (let j = 0; j < i; j++) {
        x0.push(1);
      }

      const [x, fmin, iter, success] = nelderMead(f, x0);
      expect(success).toBe(true);
      x.forEach((v) => {
        expect(Math.abs(v - 0) < eps).toBe(true);
      });
      expect(Math.abs(fmin - 0) < eps).toBe(true);
    }
  });
});
