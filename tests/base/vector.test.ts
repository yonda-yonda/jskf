import Vector from "../../src/calc/vector";
import Matrix from "../../src/calc/matrix";

describe("Vector Class", function () {
  describe("constructor:", function () {
    it("create arraylike object.", function () {
      const vec = new Vector([1, 1, 1]);
      expect(vec.toArray()).toStrictEqual([1, 1, 1]);
      expect(vec.values.length).toBe(3);
    });

    it("can be passed Infinity.", function () {
      const vec = new Vector([1, Infinity, 1]);
      expect(vec.toArray()).toStrictEqual([1, Infinity, 1]);
    });
  });

  describe("iteratable:", function () {
    let vec: Vector;
    beforeEach(function () {
      vec = new Vector([1, 2, 3]);
    });
    it("forEach", function () {
      let expectedValue = 0,
        expectedIndex = 0,
        target = 'is treated as "this" in callback.';
      vec.forEach((value: number, index: number, innerVec: Vector) => {
        expect(value).toBe(++expectedValue);
        expect(index).toBe(expectedIndex++);
        expect(vec).toStrictEqual(innerVec);
      });

      vec.forEach(function (value: number, index: number, innerVec: Vector) {
        // @ts-ignore
        expect(this).toBe(undefined);
      });

      vec.forEach(function () {
        // @ts-ignore
        expect(this).toStrictEqual(target);
      }, target);
    });
  });

  describe("splice:", function () {
    let vec: Vector, expected: number[];
    beforeEach(function () {
      vec = new Vector([1, 2, 3, 4, 5]);
      expected = [1, 2, 3, 4, 5];
    });
    it("is passed (2,0,10,20).", function () {
      const removed = vec.splice(2, 0, 10, 20);
      const removedFromExpected = expected.splice(2, 0, 10, 20);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2,2,10).", function () {
      let removed = vec.splice(2, 2, 10);
      let removedFromExpected = expected.splice(2, 2, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (0,10,10).", function () {
      let removed = vec.splice(0, 10, 10);
      let removedFromExpected = expected.splice(0, 10, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (length,0,10).", function () {
      let removed = vec.splice(vec.values.length, 0, 10);
      let removedFromExpected = expected.splice(expected.length, 0, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (-1, 0, 10).", function () {
      let removed = vec.splice(-1, 0, 10);
      let removedFromExpected = expected.splice(-1, 0, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (-3, 2, 10).", function () {
      let removed = vec.splice(-3, 2, 10);
      let removedFromExpected = expected.splice(-3, 2, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2.1,1,10).", function () {
      let removed = vec.splice(2.1, 1, 10);
      let removedFromExpected = expected.splice(2.1, 1, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2.7,1,10).", function () {
      let removed = vec.splice(2.7, 1, 10);
      let removedFromExpected = expected.splice(2.7, 1, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (-2.7,1,10).", function () {
      let removed = vec.splice(-2.7, 1, 10);
      let removedFromExpected = expected.splice(-2.7, 1, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2.1,1.1,10).", function () {
      let removed = vec.splice(2.1, 1.1, 10);
      let removedFromExpected = expected.splice(2.1, 1.1, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2.1,1.9,10).", function () {
      let removed = vec.splice(2.1, 1.9, 10);
      let removedFromExpected = expected.splice(2.1, 1.9, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2.1,-2,10).", function () {
      let removed = vec.splice(2.1, -2, 10);
      let removedFromExpected = expected.splice(2.1, -2, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (2).", function () {
      let removed = vec.splice(2);
      let removedFromExpected = expected.splice(2);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (-10).", function () {
      let removed = vec.splice(-10);
      let removedFromExpected = expected.splice(-10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });

    it("is passed (10, 0, 10).", function () {
      let removed = vec.splice(10, 0, 10);
      let removedFromExpected = expected.splice(10, 0, 10);
      expect(vec.toArray()).toStrictEqual(expected);
      expect(removed.toArray()).toStrictEqual(removedFromExpected);
    });
  });

  describe("add or remove methods:", function () {
    let vec: Vector;
    beforeEach(function () {
      vec = new Vector([1, 2, 3]);
    });
    it("unshift", function () {
      const length = vec.unshift(10);
      expect(vec.toArray()).toStrictEqual([10, 1, 2, 3]);
      expect(length).toBe(4);
    });
    it("shift", function () {
      const value = vec.shift();
      expect(vec.toArray()).toStrictEqual([2, 3]);
      expect(value).toBe(1);
    });
    it("push", function () {
      const length = vec.push(10);
      expect(vec.toArray()).toStrictEqual([1, 2, 3, 10]);
      expect(length).toBe(4);
    });
    it("pop", function () {
      const value = vec.pop();
      expect(vec.toArray()).toStrictEqual([1, 2]);
      expect(value).toBe(3);
    });
  });

  describe("toArray:", function () {
    it("converts to array.", function () {
      const vec = new Vector([1, 2, 3]);
      expect(Array.isArray(vec.toArray())).toBe(true);
    });
  });

  describe("toString:", function () {
    it("converts to string.", function () {
      const vec = new Vector([1, 2, 3]);
      expect(vec.toString()).toBe("[1, 2, 3]");
    });
  });

  describe("toMatrix:", function () {
    it("direction to row.", function () {
      const vec = new Vector([1, 2, 3]);
      expect(vec.toMatrix(0).toArray()).toStrictEqual([[1], [2], [3]]);
    });
    it("direction to col.", function () {
      const vec = new Vector([1, 2, 3]);
      expect(vec.toMatrix(1).toArray()).toStrictEqual([[1, 2, 3]]);
    });
  });

  describe("copy:", function () {
    it("duplicate oneself.", function () {
      const vec = new Vector([1, 2, 3]);
      const clone = vec.copy();
      clone.values[0] = 100;
      expect(clone.toArray()).toStrictEqual([100, 2, 3]);
      expect(vec.toArray()).toStrictEqual([1, 2, 3]);
    });
  });

  describe("slice:", function () {
    let vec: Vector, expected: number[];
    beforeEach(function () {
      vec = new Vector([1, 2, 3, 4, 5]);
      expected = [1, 2, 3, 4, 5];
    });

    it("don't change ownself.", function () {
      const result = vec.slice(2);
      expect(vec.toArray()).toStrictEqual(expected);
    });

    it("is passed (2).", function () {
      const result = vec.slice(2);
      const expectedResult = expected.slice(2);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (-2, 2).", function () {
      const result = vec.slice(-2, 2);
      const expectedResult = expected.slice(-2, 2);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (10).", function () {
      const result = vec.slice(10);
      const expectedResult = expected.slice(10);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (-10).", function () {
      const result = vec.slice(-10);
      const expectedResult = expected.slice(-10);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (3,3).", function () {
      const result = vec.slice(3, 3);
      const expectedResult = expected.slice(3, 3);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (1.2,3.9).", function () {
      const result = vec.slice(1.2, 3.9);
      const expectedResult = expected.slice(1.2, 3.9);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (1.8,3.1).", function () {
      const result = vec.slice(1.8, 3.1);
      const expectedResult = expected.slice(1.8, 3.1);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (-4.1,-1).", function () {
      const result = vec.slice(-4.1, -1);
      const expectedResult = expected.slice(-4.1, -1);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (-4.8,-1).", function () {
      const result = vec.slice(-4.8, -1);
      const expectedResult = expected.slice(-4.8, -1);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (1,-2.1).", function () {
      const result = vec.slice(1, -2.1);
      const expectedResult = expected.slice(1, -2.1);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });

    it("is passed (1,-2.9).", function () {
      const result = vec.slice(1, -2.9);
      const expectedResult = expected.slice(1, -2.9);
      expect(result.toArray()).toStrictEqual(expectedResult);
    });
  });

  describe("operator method:", function () {
    let vec: Vector, other: Vector;
    beforeEach(function () {
      vec = new Vector([1, 2]);
      other = new Vector([10, 10]);
    });

    it("don't change ownself.", function () {
      vec.ope("+", 1);
      expect(vec.toArray()).toStrictEqual([1, 2]);
    });

    it("add", function () {
      const resultScalor = vec.ope("+", 1);
      const resultVector = vec.ope("+", other);
      expect(resultScalor.toArray()).toStrictEqual([2, 3]);
      expect(resultVector.toArray()).toStrictEqual([11, 12]);
    });

    it("sub", function () {
      const resultScalor = vec.ope("-", 1);
      const resultVector = vec.ope("-", other);
      expect(resultScalor.toArray()).toStrictEqual([0, 1]);
      expect(resultVector.toArray()).toStrictEqual([-9, -8]);
    });

    it("mul", function () {
      const resultScalor = vec.ope("*", 5);
      const resultVector = vec.ope("*", other);
      expect(resultScalor.toArray()).toStrictEqual([5, 10]);
      expect(resultVector.toArray()).toStrictEqual([10, 20]);
    });

    it("div", function () {
      const resultScalor = vec.ope("/", 5);
      const resultVector = vec.ope("/", other);
      expect(resultScalor.toArray()).toStrictEqual([0.2, 0.4]);
      expect(resultVector.toArray()).toStrictEqual([0.1, 0.2]);
    });
  });

  describe("norm:", function () {
    it("calcurate Euclidean distance.", function () {
      const vec = new Vector([1, -2, 3]);
      const expected = Math.sqrt(
        Math.pow(1, 2) + Math.pow(-2, 2) + Math.pow(3, 2)
      );
      expect(vec.norm()).toStrictEqual(expected);
    });
  });

  describe("statics:", function () {
    it("calcurate mean.", function () {
      const vec = new Vector([13, 6, 5, 12, 9]);

      expect(vec.mean()).toBe(9);
    });

    it("calcurate variance.", function () {
      const vec = new Vector([14, 2, 13, 20, 16]);

      expect(vec.var()).toBe(36);
    });
  });

  describe("unit:", function () {
    it("calcurate unit vector.", function () {
      const vec = new Vector([1, -2, 3]);
      const size = Math.sqrt(Math.pow(1, 2) + Math.pow(-2, 2) + Math.pow(3, 2));
      const expected = [1 / size, -2 / size, 3 / size];
      expect(vec.unit().toArray()).toStrictEqual(expected);
    });
  });

  describe("reverse:", function () {
    it("make reversed vector.", function () {
      const vec = new Vector([1, 2, 3]);
      expect(vec.reverse().toArray()).toStrictEqual([3, 2, 1]);
    });
  });

  describe("static zeros:", function () {
    it("make vector filled by 0.", function () {
      expect(Vector.zeros(3).toArray()).toStrictEqual([0, 0, 0]);
    });

    it("round down argument.", function () {
      expect(Vector.zeros(3.8).toArray()).toStrictEqual([0, 0, 0]);
    });
  });

  describe("static ones:", function () {
    it("make vector filled by 1.", function () {
      expect(Vector.ones(3).toArray()).toStrictEqual([1, 1, 1]);
    });

    it("round down argument.", function () {
      expect(Vector.ones(3.8).toArray()).toStrictEqual([1, 1, 1]);
    });
  });

  describe("static range:", function () {
    it("is passed (1,8).", function () {
      expect(Vector.range(1, 8).toArray()).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("is passed (2, 3, 0.5).", function () {
      expect(Vector.range(2, 3, 0.5).toArray()).toStrictEqual([2, 2.5]);
    });

    it("is passed (5, 2, -1).", function () {
      expect(Vector.range(5, 2, -1).toArray()).toStrictEqual([5, 4, 3]);
    });

    it("is passed (4.5).", function () {
      expect(Vector.range(4.5).toArray()).toStrictEqual([0, 1, 2, 3, 4]);
    });

    it("is passed (1.2,7.8,-1).", function () {
      expect(Vector.range(1.2, 7.8, -1).toArray()).toStrictEqual([]);
    });

    it("is passed (-10).", function () {
      expect(Vector.range(-10).toArray()).toStrictEqual([]);
    });

    it("don't nallow 0 step.", function () {
      expect(function () {
        Vector.range(1, 10, 0);
      }).toThrowError(TypeError);
    });
  });

  describe("static isVector:", function () {
    it("check whether it is Vector.", function () {
      expect(Vector.isVector(new Vector([]))).toBe(true);
      expect(Vector.isVector([])).toBe(false);
    });
  });

  describe("concat:", function () {
    it("joins Vectors.", function () {
      const vec1 = new Vector([1, 2]);
      const vec2 = new Vector([3, 4]);
      const vec3 = new Vector([5, 6]);

      expect(vec1.concat(vec2, vec3).toArray()).toStrictEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });
  });

  describe("dot:", function () {
    it("calcurate dot.", function () {
      const vec1 = new Vector([1, 2, 3]);
      const vec2 = new Vector([10, 20, 30]);

      expect(vec1.dot(vec2)).toBe(140);
    });

    it("don't allow different size vector.", function () {
      const vec1 = new Vector([1, 2, 3]);
      const vec2 = new Vector([10, 20]);
      const mat = new Matrix([
        [10, 20],
        [100, 200],
      ]);

      expect(function () {
        vec1.dot(vec2);
      }).toThrowError(TypeError);
    });
  });

  describe("product:", function () {
    it("calcurate with matrix.", function () {
      const vec = new Vector([1, 2, 3]);
      const mat = new Matrix([
        [10, 20],
        [100, 200],
        [1000, 2000],
      ]);

      expect(vec.product(mat).toArray()).toStrictEqual([3210, 6420]);
    });
    it("calcurate with vector.", function () {
      const vec1 = new Vector([1, 2, 3]);
      const vec2 = new Vector([10, 20, 30]);

      expect(vec1.product(vec2).toArray()).toStrictEqual([
        [10, 20, 30],
        [20, 40, 60],
        [30, 60, 90],
      ]);
    });

    it("don't allow different size vector.", function () {
      const vec1 = new Vector([1, 2, 3]);
      const vec2 = new Vector([10, 20]);
      const mat = new Matrix([
        [10, 20],
        [100, 200],
      ]);

      expect(function () {
        vec1.product(vec2);
      }).toThrowError(TypeError);
      expect(function () {
        vec1.product(mat);
      }).toThrowError(TypeError);
    });
  });

  describe("cross:", function () {
    it("calcurate cross product.", function () {
      const vec1 = new Vector([1, 2, 0]);
      const vec2 = new Vector([0, 1, -1]);

      expect(vec1.cross(vec2).toArray()).toStrictEqual([-2, 1, 1]);
    });

    it("must be passed only 3-dim vector.", function () {
      const vec1 = new Vector([1, 2, 3]);
      const vec2 = new Vector([10, 20]);

      expect(function () {
        vec1.cross(vec2);
      }).toThrowError(TypeError);
    });
  });
});
