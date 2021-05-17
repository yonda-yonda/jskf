"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingularMatrixError = void 0;
const vector_1 = __importDefault(require("./vector"));
/** 非正則行列エラー */
class SingularMatrixError extends Error {
    constructor(message) {
        /**
         *    https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel
         */
        super(message);
        Object.setPrototypeOf(this, SingularMatrixError.prototype);
        this.name = this.constructor.name;
    }
}
exports.SingularMatrixError = SingularMatrixError;
const sweepOutMethod = (mat, e) => {
    /**
     *    掃き出し法による逆行列と行列式を求める。
     */
    if (mat.dimention[0] !== mat.dimention[1]) {
        throw new TypeError(`coefficient matrix is not square.`);
    }
    const swep = mat.copy(), size = swep.dimention[0];
    let det = 1.0, p = 1.0, eps = Math.pow(2, -50), amax, ip;
    swep.splice("col", size, 0, Matrix.eye(size).toArray());
    if (typeof e == "number" && e > 0) {
        eps = e;
    }
    for (let k = 0; k < size; k++) {
        amax = Math.abs(swep.values[k][k]);
        ip = k;
        for (let i = k + 1; i < size; i++) {
            if (Math.abs(swep.values[i][k]) > amax) {
                amax = Math.abs(swep.values[i][k]);
                ip = i;
            }
        }
        if (amax < eps) {
            throw new SingularMatrixError(`matrix is singular.`);
        }
        if (k !== ip) {
            let temp = swep.values[k];
            swep.values[k] = swep.values[ip];
            swep.values[ip] = temp;
            p *= -1;
        }
        det *= swep.values[k][k];
        let alpha = 1 / swep.values[k][k];
        for (let j = k; j < size * 2; j++) {
            swep.values[k][j] *= alpha;
        }
        for (let i = 0; i < size; i++) {
            if (i !== k) {
                let beta = swep.values[i][k];
                for (let j = k; j < size * 2; j++) {
                    swep.values[i][j] = swep.values[i][j] - beta * swep.values[k][j];
                }
            }
        }
    }
    det *= p;
    return {
        det,
        inv: swep.slice(0, size, size, size * 2),
    };
};
class Matrix {
    constructor(values) {
        const colLengths = Array.from(new Set(values.map((arr) => {
            return arr.length;
        })));
        if (colLengths.length > 1) {
            throw new TypeError("don't match column length.");
        }
        this.values = [];
        if (values.length > 0 && colLengths[0] > 0) {
            values.forEach((row) => {
                this.values.push(row.slice());
            });
        }
        this.dimention = [values.length, colLengths[0] || 0];
    }
    toArray() {
        const matArr = [];
        for (let i = 0; i < this.dimention[0]; i++) {
            const row = this.values[i];
            matArr.push(row.slice());
        }
        return matArr;
    }
    toString() {
        let message = "[";
        for (let i = 0; i < this.dimention[0]; i++) {
            message += this.row(i).toString();
            if (i !== this.dimention[0] - 1) {
                message += ", ";
            }
        }
        return message + "]";
    }
    copy() {
        return new Matrix(this.toArray());
    }
    splice(direction, start, end, values) {
        let directionIndex;
        let startIndex = 0, removeLength = 0;
        if (direction === "row" || direction === 0) {
            directionIndex = 0;
        }
        else {
            directionIndex = 1;
        }
        if (typeof start === "number") {
            if (start >= 0) {
                startIndex = Math.floor(start);
                if (startIndex > this.dimention[directionIndex]) {
                    startIndex = this.dimention[directionIndex];
                }
            }
            else {
                startIndex = this.dimention[directionIndex] + Math.ceil(start);
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (typeof end === "undefined") {
            removeLength = this.dimention[directionIndex] - startIndex;
        }
        else if (end > 0) {
            removeLength = Math.floor(end);
            if (startIndex + removeLength > this.dimention[directionIndex]) {
                removeLength = this.dimention[directionIndex] - startIndex;
            }
        }
        let items = values || [];
        let removed = [];
        if (direction === "row") {
            if (items.length > 0)
                items.forEach((row) => {
                    if (row.length !== this.dimention[1]) {
                        throw new TypeError(`don\'t match col length.`);
                    }
                });
            if (removeLength > 0)
                for (let i = startIndex; i < startIndex + removeLength; i++) {
                    removed.push(this.values[i].slice());
                }
            let tails = [];
            for (let i = startIndex + removeLength; i < this.dimention[0]; i++) {
                tails.push(this.values[i].slice());
            }
            let refillIndex = startIndex;
            for (let item of items) {
                this.values[refillIndex++] = item.slice();
            }
            for (let item of tails) {
                this.values[refillIndex++] = item.slice();
            }
            for (let i = refillIndex; i < this.dimention[0]; i++) {
                delete this.values[i];
            }
            this.dimention[0] = refillIndex;
            if (refillIndex === 0)
                this.dimention[1] = 0;
        }
        else {
            if (items.length > 0 && items.length !== this.dimention[0]) {
                throw new TypeError(`don\'t match row length.`);
            }
            if (removeLength > 0)
                for (let i = 0; i < this.dimention[0]; i++) {
                    const row = [];
                    for (let j = startIndex; j < startIndex + removeLength; j++) {
                        row.push(this.values[i][j]);
                    }
                    removed.push(row);
                }
            let tails = [];
            for (let i = 0; i < this.dimention[0]; i++) {
                let row = [];
                for (let j = startIndex + removeLength; j < this.dimention[1]; j++) {
                    row.push(this.values[i][j]);
                }
                tails.push(row);
            }
            let refillIndex = this.dimention[1];
            for (let i = 0; i < this.dimention[0]; i++) {
                const row = [];
                for (let j = 0; j < startIndex; j++) {
                    row[j] = this.values[i][j];
                }
                refillIndex = startIndex;
                if (Array.isArray(items[i])) {
                    for (let val of items[i]) {
                        row[refillIndex++] = val;
                    }
                }
                if (Array.isArray(tails[i])) {
                    for (let val of tails[i]) {
                        row[refillIndex++] = val;
                    }
                }
                this.values[i] = row;
            }
            this.dimention[1] = refillIndex;
            if (refillIndex === 0)
                this.dimention[0] = 0;
        }
        return new Matrix(removed);
    }
    ope(operator, val) {
        const arr = this.toArray();
        if (typeof val === "number")
            for (let i = 0; i < this.dimention[0]; i++) {
                for (let j = 0; j < this.dimention[1]; j++) {
                    switch (operator) {
                        case "+":
                            arr[i][j] += val;
                            break;
                        case "-":
                            arr[i][j] -= val;
                            break;
                        case "*":
                            arr[i][j] *= val;
                            break;
                        case "/":
                            arr[i][j] /= val;
                            break;
                    }
                }
            }
        else {
            if (this.dimention[0] !== val.dimention[0] ||
                this.dimention[1] !== val.dimention[1]) {
                throw new TypeError(`don\'t match dimentions.`);
            }
            for (let i = 0; i < this.dimention[0]; i++) {
                for (let j = 0; j < this.dimention[1]; j++) {
                    switch (operator) {
                        case "+":
                            arr[i][j] += val.values[i][j];
                            break;
                        case "-":
                            arr[i][j] -= val.values[i][j];
                            break;
                        case "*":
                            arr[i][j] *= val.values[i][j];
                            break;
                        case "/":
                            arr[i][j] /= val.values[i][j];
                            break;
                    }
                }
            }
        }
        return new Matrix(arr);
    }
    slice(startRow, startCol, endRow, endCol) {
        let rowIndex = {
            start: 0,
            end: this.dimention[0],
        };
        let colIndex = {
            start: 0,
            end: this.dimention[1],
        };
        if (typeof startRow === "number") {
            if (startRow >= 0) {
                rowIndex.start = Math.floor(startRow);
                if (rowIndex.start > this.dimention[0]) {
                    rowIndex.start = this.dimention[0];
                }
            }
            else {
                rowIndex.start = this.dimention[0] + Math.ceil(startRow);
                if (rowIndex.start < 0) {
                    rowIndex.start = 0;
                }
            }
        }
        if (typeof endRow === "number") {
            if (endRow > 0) {
                rowIndex.end = Math.floor(endRow);
                if (rowIndex.end > this.dimention[0]) {
                    rowIndex.end = this.dimention[0];
                }
            }
            else {
                rowIndex.end = this.dimention[0] + Math.ceil(endRow);
                if (rowIndex.end < 0) {
                    rowIndex.end = 0;
                }
            }
            if (rowIndex.start > rowIndex.end) {
                rowIndex.end = rowIndex.start;
            }
        }
        if (typeof startCol === "number") {
            if (startCol >= 0) {
                colIndex.start = Math.floor(startCol);
                if (colIndex.start > this.dimention[1]) {
                    colIndex.start = this.dimention[1];
                }
            }
            else {
                colIndex.start = this.dimention[1] + Math.ceil(startCol);
                if (colIndex.start < 0) {
                    colIndex.start = 0;
                }
            }
        }
        if (typeof endCol === "number") {
            if (endCol > 0) {
                colIndex.end = Math.floor(endCol);
                if (colIndex.end > this.dimention[1]) {
                    colIndex.end = this.dimention[1];
                }
            }
            else {
                colIndex.end = this.dimention[1] + Math.ceil(endCol);
                if (colIndex.end < 0) {
                    colIndex.end = 0;
                }
            }
            if (colIndex.start > colIndex.end) {
                colIndex.end = colIndex.start;
            }
        }
        const rowArr = [];
        for (let i = rowIndex.start; i < rowIndex.end; i++) {
            const colArr = [];
            for (let j = colIndex.start; j < colIndex.end; j++) {
                colArr.push(this.values[i][j]);
            }
            rowArr.push(colArr);
        }
        return new Matrix(rowArr);
    }
    row(index) {
        let row = 0;
        if (typeof index === "number") {
            if (index >= 0) {
                row = Math.floor(index);
                if (row >= this.dimention[0]) {
                    return new vector_1.default([]);
                }
            }
            else {
                row = this.dimention[0] + Math.ceil(index);
                if (row < 0) {
                    return new vector_1.default([]);
                }
            }
        }
        return new vector_1.default(this.values[row].slice());
    }
    col(index) {
        let col = 0;
        if (typeof index === "number") {
            if (index >= 0) {
                col = Math.floor(index);
                if (col >= this.dimention[1]) {
                    return new vector_1.default([]);
                }
            }
            else {
                col = this.dimention[1] + Math.ceil(index);
                if (col < 0) {
                    return new vector_1.default([]);
                }
            }
        }
        const colArr = [];
        for (let i = 0; i < this.dimention[0]; i++) {
            colArr.push(this.values[i][col]);
        }
        return new vector_1.default(colArr);
    }
    rows(start, end) {
        let startIndex = 0;
        let endIndex = this.dimention[0];
        if (typeof start === "number") {
            if (start >= 0) {
                startIndex = Math.floor(start);
                if (startIndex > this.dimention[0]) {
                    startIndex = this.dimention[0];
                }
            }
            else {
                startIndex = this.dimention[0] + Math.ceil(start);
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (typeof end === "number") {
            if (end >= 0) {
                endIndex = Math.floor(end);
                if (endIndex > this.dimention[0]) {
                    endIndex = this.dimention[0];
                }
            }
            else {
                endIndex = this.dimention[0] + Math.ceil(end);
                if (endIndex < 0) {
                    endIndex = 0;
                }
            }
            if (startIndex > endIndex) {
                endIndex = startIndex;
            }
        }
        const items = [];
        for (let i = startIndex; i < endIndex; i++) {
            items.push(this.row(i));
        }
        return items;
    }
    cols(start, end) {
        let startIndex = 0;
        let endIndex = this.dimention[1];
        if (typeof start === "number") {
            if (start >= 0) {
                startIndex = Math.floor(start);
                if (startIndex > this.dimention[1]) {
                    startIndex = this.dimention[1];
                }
            }
            else {
                startIndex = this.dimention[1] + Math.ceil(start);
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (typeof end === "number") {
            if (end >= 0) {
                endIndex = Math.floor(end);
                if (endIndex > this.dimention[1]) {
                    endIndex = this.dimention[1];
                }
            }
            else {
                endIndex = this.dimention[1] + Math.ceil(end);
                if (endIndex < 0) {
                    endIndex = 0;
                }
            }
            if (startIndex > endIndex) {
                endIndex = startIndex;
            }
        }
        const items = [];
        for (let i = startIndex; i < endIndex; i++) {
            items.push(this.col(i));
        }
        return items;
    }
    transpose() {
        let mat = Matrix.zeros(this.dimention[1], this.dimention[0]);
        for (let i = 0; i < this.dimention[0]; i++) {
            for (let j = 0; j < this.dimention[1]; j++) {
                mat.values[j][i] = this.values[i][j];
            }
        }
        return mat;
    }
    T() {
        return this.transpose();
    }
    static zeros(row, col) {
        let rowLength, colLength;
        rowLength = Math.floor(row);
        colLength = typeof col === "undefined" ? rowLength : Math.floor(col);
        const matArr = [];
        for (let i = 0; i < rowLength; i++) {
            const rowArr = [];
            for (let j = 0; j < colLength; j++) {
                rowArr.push(0);
            }
            matArr.push(rowArr);
        }
        return new Matrix(matArr);
    }
    static ones(row, col) {
        return Matrix.zeros(row, col).ope("+", 1);
    }
    static eye(row, col, pos) {
        let rowLength, colLength, position;
        rowLength = row;
        colLength = typeof col === "undefined" ? row : col;
        position = typeof pos === "undefined" ? 0 : pos;
        const mat = Matrix.zeros(rowLength, colLength);
        const size = rowLength > colLength ? rowLength : colLength;
        rowLength = Math.floor(rowLength);
        colLength = Math.floor(colLength);
        if (position >= 0) {
            position = Math.floor(position);
            if (position > mat.dimention[1])
                position = mat.dimention[1];
            for (let i = 0; i < size; i++) {
                if (typeof mat.values[i] === "undefined" ||
                    typeof mat.values[i][i + position] === "undefined")
                    break;
                mat.values[i][i + position] = 1;
            }
        }
        else {
            position *= -1;
            position = Math.floor(position);
            if (position > mat.dimention[0])
                position = mat.dimention[0];
            for (let i = 0; i < size; i++) {
                if (typeof mat.values[i + position] === "undefined" ||
                    typeof mat.values[i + position][i] === "undefined")
                    break;
                mat.values[i + position][i] = 1;
            }
        }
        return mat;
    }
    static isMatrix(obj) {
        return obj instanceof Matrix;
    }
    static hstack(...mats) {
        /**
         *   列方向に行列を連結する。破壊的操作を行う。
         */
        mats.forEach((mat, index) => {
            if (!Matrix.isMatrix(mat)) {
                throw new TypeError(`the ${index}-th argument is not Matrix.`);
            }
        });
        if (Array.from(new Set(mats.map((mat) => {
            return mat.dimention[0];
        }))).length !== 1) {
            throw new TypeError("don't match row length.");
        }
        const result = mats[0].copy();
        for (let i = 1; i < mats.length; i++) {
            result.splice("col", result.dimention[1], 0, mats[i].toArray());
        }
        return result;
    }
    static vstack(...mats) {
        /**
         *   行方向に行列を連結する。破壊的操作を行う。
         */
        mats.forEach((mat, index) => {
            if (!Matrix.isMatrix(mat)) {
                throw new TypeError(`the ${index}-th argument is not Matrix.`);
            }
        });
        if (Array.from(new Set(mats.map((mat) => {
            return mat.dimention[1];
        }))).length !== 1) {
            throw new TypeError("don't match col length.");
        }
        const result = mats[0].copy();
        for (let i = 1; i < mats.length; i++) {
            result.splice("row", result.dimention[0], 0, mats[i].toArray());
        }
        return result;
    }
    product(val) {
        if (vector_1.default.isVector(val)) {
            const vec = val;
            if (this.dimention[1] !== vec.values.length) {
                throw new TypeError(`don\'t match dimentions.`);
            }
            const result = [];
            const rows = this.rows();
            rows.forEach((row) => {
                result.push(row.dot(vec));
            });
            return new vector_1.default(result);
        }
        else {
            const mat = val;
            if (this.dimention[1] !== mat.dimention[0]) {
                throw new TypeError(`don\'t match dimentions.`);
            }
            const result = [];
            this.rows().forEach((row) => {
                const values = [];
                mat.cols().forEach((col) => {
                    values.push(row.dot(col));
                });
                result.push(values);
            });
            return new Matrix(result);
        }
    }
    inv(e) {
        return sweepOutMethod(this, e).inv;
    }
    det(e) {
        return sweepOutMethod(this, e).det;
    }
    isNonSingular(e) {
        try {
            sweepOutMethod(this, e);
        }
        catch (err) {
            if (err instanceof SingularMatrixError) {
                return false;
            }
        }
        return true;
    }
}
exports.default = Matrix;
