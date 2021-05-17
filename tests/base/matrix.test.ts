import Vector from "../../src/calc/vector";
import Matrix from "../../src/calc/matrix";

describe("Matrix Class", function () {
  describe("constructor:", function () {
    it("has dimention.", function () {
      let mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      expect(mat.dimention[0]).toBe(2);
      expect(mat.dimention[1]).toBe(3);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
      ]);
    });

    it("create from array.", function () {
      let mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      expect(mat.dimention[0]).toBe(2);
      expect(mat.dimention[1]).toBe(3);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
      ]);
    });

    it("can be passed Infinity.", function () {
      let mat = new Matrix([
        [1, 2, 3],
        [10, 20, Infinity],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, Infinity],
      ]);
    });
  });

  describe("toArray:", function () {
    it("converts to array.", function () {
      const mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      const converted = mat.toArray();
      expect(Array.isArray(converted)).toBe(true);
      expect(converted.length).toBe(mat.dimention[0]);
      expect(Array.isArray(converted[0])).toBe(true);
      expect(converted[0].length).toBe(mat.dimention[1]);
    });
  });

  describe("toString:", function () {
    it("converts to string.", function () {
      let mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      expect(mat.toString()).toBe("[[1, 2, 3], [10, 20, 30]]");
    });
  });

  describe("copy:", function () {
    it("duplicate oneself.", function () {
      const mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      const clone = mat.copy();
      clone.values[0][0] = 100;
      expect(clone.toArray()).toStrictEqual([
        [100, 2, 3],
        [10, 20, 30],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
      ]);
    });
  });

  describe("row:", function () {
    let mat: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
    });

    it("create Vector object.", function () {
      expect(Vector.isVector(mat.row(1))).toBe(true);
    });

    it("is passed (1).", function () {
      expect(mat.row(1).toArray()).toStrictEqual([10, 20, 30]);
    });

    it("is passed (length).", function () {
      expect(mat.row(mat.dimention[0]).toArray()).toStrictEqual([]);
    });

    it("is passed (-1).", function () {
      expect(mat.row(-1).toArray()).toStrictEqual([10, 20, 30]);
    });

    it("is passed (1.7).", function () {
      expect(mat.row(1.7).toArray()).toStrictEqual([10, 20, 30]);
    });

    it("is passed (-1.2).", function () {
      expect(mat.row(-1.2).toArray()).toStrictEqual([10, 20, 30]);
    });

    it("is passed (-10).", function () {
      expect(mat.row(-10).toArray()).toStrictEqual([]);
    });
  });

  describe("col:", function () {
    let mat: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
    });

    it("create Vector object.", function () {
      expect(Vector.isVector(mat.col(1))).toBe(true);
    });

    it("is passed (1).", function () {
      expect(mat.col(1).toArray()).toStrictEqual([2, 20]);
    });

    it("is passed (length).", function () {
      expect(mat.col(mat.dimention[1]).toArray()).toStrictEqual([]);
    });

    it("is passed (-1).", function () {
      expect(mat.col(-1).toArray()).toStrictEqual([3, 30]);
    });

    it("is passed (1.6).", function () {
      expect(mat.col(1.6).toArray()).toStrictEqual([2, 20]);
    });

    it("is passed (-1.5).", function () {
      expect(mat.col(-1.5).toArray()).toStrictEqual([3, 30]);
    });

    it("is passed (-10).", function () {
      expect(mat.col(-10).toArray()).toStrictEqual([]);
    });
  });

  describe("rows:", function () {
    let mat: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3, 4],
        [10, 20, 30, 40],
        [100, 200, 300, 400],
        [1000, 2000, 3000, 4000],
      ]);
    });

    it("create arraylike object.", function () {
      const rows = mat.rows(2);

      for (let row of rows) {
        expect(Vector.isVector(row)).toBe(true);
      }

      let expectedIndex = 0;
      const target = 'is treated as "this" in callback.';
      rows.forEach((value: Vector, index: number, inner: Vector[]) => {
        expect(Vector.isVector(value)).toBe(true);
        expect(index).toBe(expectedIndex++);
        expect(inner).toStrictEqual(rows);
      });

      rows.forEach(function () {
        // @ts-ignore
        expect(this).toBe(undefined);
      });

      rows.forEach(function () {
        // @ts-ignore
        expect(this).toBe(target);
      }, target);
    });

    it("is passed (2).", function () {
      const rows = mat.rows(2);
      expect(rows[0].toArray()).toStrictEqual([100, 200, 300, 400]);
      expect(rows[1].toArray()).toStrictEqual([1000, 2000, 3000, 4000]);
      expect(rows.length).toBe(2);
    });

    it("is passed (2, 3).", function () {
      const rows = mat.rows(2, 3);
      expect(rows[0].toArray()).toStrictEqual([100, 200, 300, 400]);
      expect(rows.length).toBe(1);
    });

    it("is passed (2, 10).", function () {
      const rows = mat.rows(2, 10);
      expect(rows[0].toArray()).toStrictEqual([100, 200, 300, 400]);
      expect(rows[1].toArray()).toStrictEqual([1000, 2000, 3000, 4000]);
      expect(rows.length).toBe(2);
    });

    it("is passed (-1).", function () {
      const rows = mat.rows(-1);
      expect(rows[0].toArray()).toStrictEqual([1000, 2000, 3000, 4000]);
      expect(rows.length).toBe(1);
    });

    it("is passed (1, -2).", function () {
      const rows = mat.rows(1, -2);
      expect(rows[0].toArray()).toStrictEqual([10, 20, 30, 40]);
      expect(rows.length).toBe(1);
    });

    it("is passed (-10).", function () {
      const rows = mat.rows(-10);
      expect(rows[0].toArray()).toStrictEqual([1, 2, 3, 4]);
      expect(rows[1].toArray()).toStrictEqual([10, 20, 30, 40]);
      expect(rows[2].toArray()).toStrictEqual([100, 200, 300, 400]);
      expect(rows[3].toArray()).toStrictEqual([1000, 2000, 3000, 4000]);
      expect(rows.length).toBe(4);
    });

    it("is passed (-1, 0).", function () {
      const rows = mat.rows(-1, 0);
      expect(rows[0]).toBe(undefined);
      expect(rows.length).toBe(0);
    });

    it("is passed (1.7, 2.7).", function () {
      const rows = mat.rows(1.7, 2.7);
      expect(rows[0].toArray()).toStrictEqual([10, 20, 30, 40]);
      expect(rows.length).toBe(1);
    });

    it("is passed (1.3, -2.7).", function () {
      const rows = mat.rows(1.3, -2.7);
      expect(rows[0].toArray()).toStrictEqual([10, 20, 30, 40]);
      expect(rows.length).toBe(1);
    });
  });

  describe("cols:", function () {
    let mat: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3, 4],
        [10, 20, 30, 40],
        [100, 200, 300, 400],
        [1000, 2000, 3000, 4000],
      ]);
    });

    it("create arraylike object.", function () {
      const cols = mat.cols(2);

      for (let col of cols) {
        expect(Vector.isVector(col)).toBe(true);
      }

      let expectedIndex = 0;
      const target = 'is treated as "this" in callback.';
      cols.forEach((value: Vector, index: number, inner: Vector[]) => {
        expect(Vector.isVector(value)).toBe(true);
        expect(index).toBe(expectedIndex++);
        expect(inner).toStrictEqual(cols);
      });

      cols.forEach(function () {
        // @ts-ignore
        expect(this).toStrictEqual(undefined);
      });

      cols.forEach(function () {
        // @ts-ignore
        expect(this).toStrictEqual(target);
      }, target);
    });

    it("is passed (2).", function () {
      const cols = mat.cols(2);
      expect(cols[0].toArray()).toStrictEqual([3, 30, 300, 3000]);
      expect(cols[1].toArray()).toStrictEqual([4, 40, 400, 4000]);
      expect(cols.length).toBe(2);
    });

    it("is passed (2, 3).", function () {
      const cols = mat.cols(2, 3);
      expect(cols[0].toArray()).toStrictEqual([3, 30, 300, 3000]);
      expect(cols.length).toBe(1);
    });

    it("is passed (2, 10).", function () {
      const cols = mat.cols(2, 10);
      expect(cols[0].toArray()).toStrictEqual([3, 30, 300, 3000]);
      expect(cols[1].toArray()).toStrictEqual([4, 40, 400, 4000]);
      expect(cols.length).toBe(2);
    });

    it("is passed (1, -2).", function () {
      const cols = mat.cols(1, -2);
      expect(cols[0].toArray()).toStrictEqual([2, 20, 200, 2000]);
      expect(cols.length).toBe(1);
    });

    it("is passed (-1).", function () {
      const cols = mat.cols(-1);
      expect(cols[0].toArray()).toStrictEqual([4, 40, 400, 4000]);
      expect(cols.length).toBe(1);
    });

    it("is passed (-10).", function () {
      const cols = mat.cols(-10);
      expect(cols[0].toArray()).toStrictEqual([1, 10, 100, 1000]);
      expect(cols[1].toArray()).toStrictEqual([2, 20, 200, 2000]);
      expect(cols[2].toArray()).toStrictEqual([3, 30, 300, 3000]);
      expect(cols[3].toArray()).toStrictEqual([4, 40, 400, 4000]);
      expect(cols.length).toBe(4);
    });

    it("is passed (-1, 0).", function () {
      const cols = mat.cols(-1, 0);
      expect(cols[0]).toBe(undefined);
      expect(cols.length).toBe(0);
    });

    it("is passed (1.2, 2.7).", function () {
      const cols = mat.cols(1.2, 2.7);
      expect(cols[0].toArray()).toStrictEqual([2, 20, 200, 2000]);
      expect(cols.length).toBe(1);
    });

    it("is passed (1.2, -2.7).", function () {
      const cols = mat.cols(1.2, -2.7);
      expect(cols[0].toArray()).toStrictEqual([2, 20, 200, 2000]);
      expect(cols.length).toBe(1);
    });
  });

  describe("product with Matrix:", function () {
    it("product Matrix(2 * 2) and Matrix(2 * 2).", function () {
      const mat1 = new Matrix([
        [1, 3],
        [2, 4],
      ]);
      const mat2 = new Matrix([
        [4, 1],
        [3, 2],
      ]);

      expect(mat1.product(mat2).toArray()).toStrictEqual([
        [13, 7],
        [20, 10],
      ]);
    });

    it("product Matrix(2 * 2) and Vector(2).", function () {
      const mat = new Matrix([
        [1, 3],
        [2, 4],
      ]);
      const vec = new Vector([1, 2]);

      expect(mat.product(vec).toArray()).toStrictEqual([7, 10]);
    });

    it("product Matrix(2 * 2) and Matrix(2 * 1).", function () {
      const mat1 = new Matrix([
        [1, 3],
        [2, 4],
      ]);
      const mat2 = new Matrix([[1], [2]]);

      expect(mat1.product(mat2).toArray()).toStrictEqual([[7], [10]]);
    });

    it("product Matrix(1 * 2) and Matrix(2 * 2).", function () {
      const mat1 = new Matrix([[1, 0, 2]]);
      const mat2 = new Matrix([
        [1, 0, 1],
        [2, 1, 0],
        [0, 0, 2],
      ]);

      expect(mat1.product(mat2).toArray()).toStrictEqual([[1, 0, 5]]);
    });

    it("don't allow different size vector.", function () {
      const mat = new Matrix([
        [1, 3],
        [2, 4],
      ]);
      const vec = new Vector([1, 2, 3]);

      expect(function () {
        mat.product(vec);
      }).toThrowError(TypeError);
    });

    it("don't allow different size matrix.", function () {
      const mat1 = new Matrix([
        [1, 3],
        [2, 4],
      ]);
      const mat2 = new Matrix([
        [1, 0, 1],
        [2, 1, 0],
        [0, 0, 2],
      ]);

      expect(function () {
        mat1.product(mat2);
      }).toThrowError(TypeError);
    });
  });

  describe("splice:", function () {
    let mat: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("row", 2,0,[-1,-2,-3],[-10,-20,-30]).', function () {
      const removed = mat.splice("row", 2, 0, [
        [-1, -2, -3],
        [-10, -20, -30],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [-1, -2, -3],
        [-10, -20, -30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([6, 3]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("row", 1,2,[-1,-2,-3]).', function () {
      const removed = mat.splice("row", 1, 2, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", 0,10,[-1,-2,-3]).', function () {
      const removed = mat.splice("row", 0, 10, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([[-1, -2, -3]]);
      expect(mat.dimention).toStrictEqual([1, 3]);
      expect(removed.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("row", length,0,[-1,-2,-3]).', function () {
      const removed = mat.splice("row", mat.dimention[0], 0, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
        [-1, -2, -3],
      ]);
      expect(mat.dimention).toStrictEqual([5, 3]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("row", -1, 0, [-1,-2,-3]).', function () {
      const removed = mat.splice("row", -1, 0, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([5, 3]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("row", -3, 2, [-1,-2,-3]).', function () {
      const removed = mat.splice("row", -3, 2, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", 1.2,2,[-1,-2,-3]).', function () {
      const removed = mat.splice("row", 1.2, 2, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", 1.9,2,[-1,-2,-3]).', function () {
      const removed = mat.splice("row", 1.9, 2, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", 1.2,2.1,[-1,-2,-3]).', function () {
      const removed = mat.splice("row", 1.2, 2.1, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", -3.2, 2, [-1,-2,-3]).', function () {
      const removed = mat.splice("row", -3.2, 2, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", -3.9, 2, [-1,-2,-3]).', function () {
      const removed = mat.splice("row", -3.9, 2, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", -3.9, 2.8, [-1,-2,-3]).', function () {
      const removed = mat.splice("row", -3.9, 2.8, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [-1, -2, -3],
        [1000, 2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([3, 3]);
      expect(removed.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it('is passed ("row", 2).', function () {
      const removed = mat.splice("row", 2);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      expect(mat.dimention).toStrictEqual([2, 3]);
      expect(removed.toArray()).toStrictEqual([
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("row", -10).', function () {
      const removed = mat.splice("row", -10);
      expect(mat.toArray()).toStrictEqual([]);
      expect(mat.dimention).toStrictEqual([0, 0]);
      expect(removed.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("row", -10, undefined).', function () {
      const removed = mat.splice("row", -10);
      expect(mat.toArray()).toStrictEqual([]);
      expect(mat.dimention).toStrictEqual([0, 0]);
      expect(removed.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("row", 10, 0, [-1,-2,-3]).', function () {
      const removed = mat.splice("row", 10, 0, [[-1, -2, -3]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
        [-1, -2, -3],
      ]);
      expect(mat.dimention).toStrictEqual([5, 3]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("col", 2,0,[-1,-2],[-10,-20],[-100,-200],[-1000,-2000]).', function () {
      const removed = mat.splice("col", 2, 0, [
        [-1, -2],
        [-10, -20],
        [-100, -200],
        [-1000, -2000],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, -1, -2, 3],
        [10, 20, -10, -20, 30],
        [100, 200, -100, -200, 300],
        [1000, 2000, -1000, -2000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 5]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("col", 1,2,[-1],[-10],[-100],[-1000]).', function () {
      const removed = mat.splice("col", 1, 2, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", 0,10,[-1],[-10],[-100],[-1000]).', function () {
      const removed = mat.splice("col", 0, 10, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([[-1], [-10], [-100], [-1000]]);
      expect(mat.dimention).toStrictEqual([4, 1]);
      expect(removed.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("col", mat.dimention[1], 0, [-1], [-10], [-100], [-1000]).', function () {
      const removed = mat.splice("col", mat.dimention[1], 0, [
        [-1],
        [-10],
        [-100],
        [-1000],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3, -1],
        [10, 20, 30, -10],
        [100, 200, 300, -100],
        [1000, 2000, 3000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 4]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("col", -1, 0, [-1], [-10], [-100], [-1000]).', function () {
      const removed = mat.splice("col", -1, 0, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, -1, 3],
        [10, 20, -10, 30],
        [100, 200, -100, 300],
        [1000, 2000, -1000, 3000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 4]);
      expect(removed.toArray()).toStrictEqual([]);
    });

    it('is passed ("col", -2, 2, [-1], [-10], [-100], [-1000]).', function () {
      const removed = mat.splice("col", -2, 2, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", 1.2,2,[-1],[-10],[-100],[-1000]).', function () {
      const removed = mat.splice("col", 1.2, 2, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", 1.9,2,[-1],[-10],[-100],[-1000]).', function () {
      const removed = mat.splice("col", 1.9, 2, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", 1.9,2.8,[-1],[-10],[-100],[-1000]).', function () {
      const removed = mat.splice("col", 1.9, 2.8, [
        [-1],
        [-10],
        [-100],
        [-1000],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", -2.2, 2, [-1], [-10], [-100], [-1000]).', function () {
      const removed = mat.splice("col", -2.2, 2, [
        [-1],
        [-10],
        [-100],
        [-1000],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", -2.9, 2, [-1], [-10], [-100], [-1000]).', function () {
      const removed = mat.splice("col", -2.9, 2, [
        [-1],
        [-10],
        [-100],
        [-1000],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", -2.2, 2.4, [-1], [-10], [-100], [-1000]).', function () {
      const removed = mat.splice("col", -2.2, 2, [
        [-1],
        [-10],
        [-100],
        [-1000],
      ]);
      expect(mat.toArray()).toStrictEqual([
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 2]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", 2).', function () {
      const removed = mat.splice("col", 1);
      expect(mat.toArray()).toStrictEqual([[1], [10], [100], [1000]]);
      expect(mat.dimention).toStrictEqual([4, 1]);
      expect(removed.toArray()).toStrictEqual([
        [2, 3],
        [20, 30],
        [200, 300],
        [2000, 3000],
      ]);
    });

    it('is passed ("col", -10).', function () {
      const removed = mat.splice("col", -10);
      expect(mat.toArray()).toStrictEqual([]);
      expect(mat.dimention).toStrictEqual([0, 0]);
      expect(removed.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it('is passed ("col", 10, 0, [-1,-2,-3]).', function () {
      const removed = mat.splice("col", 10, 0, [[-1], [-10], [-100], [-1000]]);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3, -1],
        [10, 20, 30, -10],
        [100, 200, 300, -100],
        [1000, 2000, 3000, -1000],
      ]);
      expect(mat.dimention).toStrictEqual([4, 4]);
      expect(removed.toArray()).toStrictEqual([]);
    });
  });

  describe("operator method:", function () {
    let mat: Matrix, other: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
      ]);
      other = new Matrix([
        [10, 10, 10],
        [10, 10, 10],
      ]);
    });

    it("don't change ownself.", function () {
      mat.ope("+", 1);
      expect(mat.toArray()).toStrictEqual([
        [1, 2, 3],
        [10, 20, 30],
      ]);
    });

    it("add", function () {
      const resultScalor = mat.ope("+", 1);
      const resultMatrix = mat.ope("+", other);
      expect(resultScalor.toArray()).toStrictEqual([
        [2, 3, 4],
        [11, 21, 31],
      ]);
      expect(resultMatrix.toArray()).toStrictEqual([
        [11, 12, 13],
        [20, 30, 40],
      ]);
    });

    it("sub", function () {
      const resultScalor = mat.ope("-", 1);
      const resultMatrix = mat.ope("-", other);
      expect(resultScalor.toArray()).toStrictEqual([
        [0, 1, 2],
        [9, 19, 29],
      ]);
      expect(resultMatrix.toArray()).toStrictEqual([
        [-9, -8, -7],
        [0, 10, 20],
      ]);
    });

    it("mul", function () {
      const resultScalor = mat.ope("*", 5);
      const resultMatrix = mat.ope("*", other);
      expect(resultScalor.toArray()).toStrictEqual([
        [5, 10, 15],
        [50, 100, 150],
      ]);
      expect(resultMatrix.toArray()).toStrictEqual([
        [10, 20, 30],
        [100, 200, 300],
      ]);
    });

    it("div", function () {
      const resultScalor = mat.ope("/", 2);
      const resultMatrix = mat.ope("/", other);
      expect(resultScalor.toArray()).toStrictEqual([
        [0.5, 1, 1.5],
        [5, 10, 15],
      ]);
      expect(resultMatrix.toArray()).toStrictEqual([
        [0.1, 0.2, 0.3],
        [1, 2, 3],
      ]);
    });
  });

  describe("slice:", function () {
    let mat: Matrix;
    beforeEach(function () {
      mat = new Matrix([
        [1, 2, 3],
        [10, 20, 30],
        [100, 200, 300],
        [1000, 2000, 3000],
      ]);
    });

    it("is passed (2,1,4,2).", function () {
      let sliced = mat.slice(2, 1, 4, 2);
      expect(sliced.dimention).toStrictEqual([2, 1]);
      expect(sliced.toArray()).toStrictEqual([[200], [2000]]);
    });

    it("is passed (1,1,-1,-1).", function () {
      let sliced = mat.slice(1, 1, -1, -1);
      expect(sliced.dimention).toStrictEqual([2, 1]);
      expect(sliced.toArray()).toStrictEqual([[20], [200]]);
    });

    it("is passed (-3,-2,-1,-1).", function () {
      let sliced = mat.slice(-3, -2, -1, -1);
      expect(sliced.dimention).toStrictEqual([2, 1]);
      expect(sliced.toArray()).toStrictEqual([[20], [200]]);
    });

    it("is passed (1.2,1.9,-1.8,-1.4).", function () {
      let sliced = mat.slice(1.2, 1.9, -1.8, -1.4);
      expect(sliced.dimention).toStrictEqual([2, 1]);
      expect(sliced.toArray()).toStrictEqual([[20], [200]]);
    });

    it("is passed (-3.6,-2.2,-1.4,-1.9).", function () {
      let sliced = mat.slice(-3.6, -2.2, -1.4, -1.9);
      expect(sliced.dimention).toStrictEqual([2, 1]);
      expect(sliced.toArray()).toStrictEqual([[20], [200]]);
    });
  });

  describe("transpose:", function () {
    it("create (j * i) matrix.", function () {
      expect(
        new Matrix([
          [1, 2, 3],
          [10, 20, 30],
        ])
          .transpose()
          .toArray()
      ).toStrictEqual([
        [1, 10],
        [2, 20],
        [3, 30],
      ]);
    });
  });

  describe("static zeros:", function () {
    it("make matrix filled by 0.", function () {
      expect(Matrix.zeros(2).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
      ]);
      expect(Matrix.zeros(3, 2).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });

    it("round down argument.", function () {
      expect(Matrix.zeros(2.8).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
      ]);
      expect(Matrix.zeros(3, 2.3).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });
  });

  describe("static ones:", function () {
    it("make matrix filled by 1.", function () {
      expect(Matrix.ones(2).toArray()).toStrictEqual([
        [1, 1],
        [1, 1],
      ]);
      expect(Matrix.ones(3, 2).toArray()).toStrictEqual([
        [1, 1],
        [1, 1],
        [1, 1],
      ]);
    });

    it("round down argument.", function () {
      expect(Matrix.ones(2.1).toArray()).toStrictEqual([
        [1, 1],
        [1, 1],
      ]);
      expect(Matrix.ones(3, 2.7).toArray()).toStrictEqual([
        [1, 1],
        [1, 1],
        [1, 1],
      ]);
    });
  });

  describe("static eye:", function () {
    it("make matrix that diagonal elements are 1.", function () {
      expect(Matrix.eye(3).toArray()).toStrictEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
      expect(Matrix.eye(3, 2).toArray()).toStrictEqual([
        [1, 0],
        [0, 1],
        [0, 0],
      ]);

      expect(Matrix.eye(3, 2, 1).toArray()).toStrictEqual([
        [0, 1],
        [0, 0],
        [0, 0],
      ]);

      expect(Matrix.eye(3, 2, -1).toArray()).toStrictEqual([
        [0, 0],
        [1, 0],
        [0, 1],
      ]);

      expect(Matrix.eye(3, 2, 10).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);

      expect(Matrix.eye(3, 2, -10).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });

    it("round down argument.", function () {
      expect(Matrix.eye(3.3, 2, 10.8).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);

      expect(Matrix.eye(3, 2.5, -10.2).toArray()).toStrictEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });
  });

  describe("static hstack:", function () {
    it("make expanded matrix.", function () {
      const addMat1 = new Matrix([
        [-1, -2],
        [-10, -20],
      ]);
      const addMat2 = new Matrix([[-3], [-30]]);
      expect(Matrix.hstack(addMat1, addMat2).toArray()).toStrictEqual([
        [-1, -2, -3],
        [-10, -20, -30],
      ]);
    });
    it("don't match row length.", function () {
      const addMat1 = new Matrix([
        [-1, -2],
        [-10, -20],
      ]);
      const addMat2 = new Matrix([[-3], [-30], [-40]]);
      expect(function () {
        Matrix.hstack(addMat1, addMat2);
      }).toThrowError(TypeError);
    });
  });

  describe("static vstack:", function () {
    it("make expanded matrix.", function () {
      const addMat1 = new Matrix([
        [-1, -2],
        [-10, -20],
      ]);
      const addMat2 = new Matrix([
        [-100, -200],
        [-1000, -2000],
      ]);
      expect(Matrix.vstack(addMat1, addMat2).toArray()).toStrictEqual([
        [-1, -2],
        [-10, -20],
        [-100, -200],
        [-1000, -2000],
      ]);
    });

    it("don't match row length.", function () {
      const addMat1 = new Matrix([
        [-1, -2],
        [-10, -20],
      ]);
      const addMat2 = new Matrix([
        [-100, -200, 1],
        [-1000, -2000, 2],
      ]);
      expect(function () {
        Matrix.vstack(addMat1, addMat2);
      }).toThrowError(TypeError);
    });
  });

  describe("inverse: ", function () {
    it("A=[[1, 1, 1, -1], [1, 1, -1, 1], [1, -1, 1, 1], [-1, 1, 1, 1]]", function () {
      const result = new Matrix([
        [1, 1, 1, -1],
        [1, 1, -1, 1],
        [1, -1, 1, 1],
        [-1, 1, 1, 1],
      ]).inv();

      const expected = [
        [0.25, 0.25, 0.25, -0.25],
        [0.25, 0.25, -0.25, 0.25],
        [0.25, -0.25, 0.25, 0.25],
        [-0.25, 0.25, 0.25, 0.25],
      ];

      for (let i = 0; i < expected.length; i++) {
        for (let j = 0; j < expected.length; j++) {
          expect(
            Math.abs(expected[i][j] - result.values[i][j]) < Math.pow(10, -6)
          ).toBe(true);
        }
      }
    });
  });

  describe("det: ", function () {
    it("A=[[3, −2, −5],[2, 3, 4],[6, −1, 6]]", function () {
      const result = new Matrix([
        [3, -2, -5],
        [2, 3, 4],
        [6, -1, 6],
      ]).det();
      expect(result).toBe(142);
    });
  });

  describe("isNonSingular: ", function () {
    it("A=[[2, 4, 2], [1, 3, 4], [3, 8, 11]] is non-singular", function () {
      const result = new Matrix([
        [2, 4, 2],
        [1, 3, 4],
        [3, 8, 11],
      ]).isNonSingular();
      expect(result).toBe(true);
    });

    it("A=[[0, 0, 0], [0, 0, 0], [0, 0, 0]] is Singular", function () {
      let result = new Matrix([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]).isNonSingular();
      expect(result).toBe(false);
    });
  });
});
