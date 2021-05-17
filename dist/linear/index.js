"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _observed, _state;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../calc/index");
const isStateType = (arg) => ["estimated", "filtered", "smoothed"].includes(arg);
class Linear {
    constructor(props) {
        var _a, _b;
        _observed.set(this, void 0);
        _state.set(this, void 0);
        this.F = Array.isArray(props.F)
            ? new index_1.Matrix(props.F)
            : new index_1.Matrix([[props.F]]);
        this.G = Array.isArray(props.G)
            ? new index_1.Matrix(props.G)
            : new index_1.Matrix([[props.G]]);
        this.H = Array.isArray(props.H)
            ? new index_1.Matrix(props.H)
            : new index_1.Matrix([[props.H]]);
        this.Q = Array.isArray(props.Q)
            ? new index_1.Matrix(props.Q)
            : new index_1.Matrix([[props.Q]]);
        this.R = Array.isArray(props.R)
            ? new index_1.Matrix(props.R)
            : new index_1.Matrix([[props.R]]);
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
        if ((_a = props === null || props === void 0 ? void 0 : props.init) === null || _a === void 0 ? void 0 : _a.x) {
            if (Array.isArray(props.init.x))
                x0 = new index_1.Vector(props.init.x);
            else
                x0 = new index_1.Vector([props.init.x]);
        }
        else {
            x0 = index_1.Vector.zeros(x_size);
        }
        if ((_b = props === null || props === void 0 ? void 0 : props.init) === null || _b === void 0 ? void 0 : _b.cov) {
            if (Array.isArray(props.init.cov))
                cov0 = new index_1.Matrix(props.init.cov);
            else
                cov0 = new index_1.Matrix([[props.init.cov]]);
        }
        else {
            cov0 = index_1.Matrix.eye(x_size).ope("*", 10000000);
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
        this._GQGT = index_1.products(this.G, this.Q, this.G.T());
        this._FT = this.F.T();
        this._HT = this.H.T();
        this.size = {
            x: x_size,
            y: y_size,
        };
        this.init = init;
        __classPrivateFieldSet(this, _observed, []);
        __classPrivateFieldSet(this, _state, {
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
        });
        if (props.y) {
            props.y.forEach((y) => {
                this.update(y);
            });
        }
    }
    current() {
        return __classPrivateFieldGet(this, _observed).length;
    }
    estimate() {
        const current = this.current();
        const x_prev = current < 2 ? this.init.x : __classPrivateFieldGet(this, _state).filtered.x[current - 2];
        const cov_prev = current < 2 ? this.init.cov : __classPrivateFieldGet(this, _state).filtered.cov[current - 2];
        const x = this.F.product(x_prev);
        const cov = index_1.products(this.F, cov_prev, this._FT).ope("+", this._GQGT);
        __classPrivateFieldGet(this, _state).estimated.x.push(x);
        __classPrivateFieldGet(this, _state).estimated.cov.push(cov);
    }
    filtering(observed) {
        const current = this.current();
        const x_prev = __classPrivateFieldGet(this, _state).estimated.x[current - 1];
        const cov_prev = __classPrivateFieldGet(this, _state).estimated.cov[current - 1];
        if (observed) {
            const K = index_1.products(cov_prev, this._HT, index_1.products(this.H, cov_prev, this._HT).ope("+", this.R).inv());
            const x = index_1.sum(this.F.product(x_prev), K.product(observed.ope("-", this.H.product(x_prev))));
            const cov = cov_prev.ope("-", index_1.products(K, this.H, cov_prev));
            __classPrivateFieldGet(this, _state).filtered.x.push(x);
            __classPrivateFieldGet(this, _state).filtered.cov.push(cov);
        }
        else {
            __classPrivateFieldGet(this, _state).filtered.x.push(x_prev);
            __classPrivateFieldGet(this, _state).filtered.cov.push(cov_prev);
        }
    }
    smooth() {
        const current = this.current();
        if (__classPrivateFieldGet(this, _state).smoothed.last === current)
            return;
        __classPrivateFieldGet(this, _state).smoothed.last = current;
        __classPrivateFieldGet(this, _state).smoothed.x = [];
        __classPrivateFieldGet(this, _state).smoothed.cov = [];
        __classPrivateFieldGet(this, _state).smoothed.x[current - 1] = __classPrivateFieldGet(this, _state).filtered.x[current - 1];
        __classPrivateFieldGet(this, _state).smoothed.cov[current - 1] =
            __classPrivateFieldGet(this, _state).filtered.cov[current - 1];
        for (let i = current - 1; i > 0; i--) {
            const x_prev = __classPrivateFieldGet(this, _state).smoothed.x[i];
            const cov_prev = __classPrivateFieldGet(this, _state).smoothed.cov[i];
            const filteredX = __classPrivateFieldGet(this, _state).filtered.x[i - 1];
            const estimatedX = __classPrivateFieldGet(this, _state).estimated.x[i];
            const filteredCov = __classPrivateFieldGet(this, _state).filtered.cov[i - 1];
            const estimatedCov = __classPrivateFieldGet(this, _state).estimated.cov[i];
            const C = filteredCov
                .product(this._FT)
                .product(estimatedCov.inv());
            const x = filteredX.ope("+", C.product(x_prev.ope("-", estimatedX)));
            const cov = filteredCov.ope("+", index_1.products(C, cov_prev.ope("-", estimatedCov), C.T()));
            __classPrivateFieldGet(this, _state).smoothed.x[i - 1] = x;
            __classPrivateFieldGet(this, _state).smoothed.cov[i - 1] = cov;
        }
    }
    forecast(end) {
        const current = this.current();
        if (end <= current)
            return;
        let start;
        if (__classPrivateFieldGet(this, _state).forecasted.last.start < current) {
            __classPrivateFieldGet(this, _state).forecasted.last.start = current;
            __classPrivateFieldGet(this, _state).forecasted.x = [];
            __classPrivateFieldGet(this, _state).forecasted.cov = [];
            start = current;
        }
        else {
            if (__classPrivateFieldGet(this, _state).forecasted.last.end >= end)
                return;
            start = __classPrivateFieldGet(this, _state).forecasted.last.end;
        }
        __classPrivateFieldGet(this, _state).forecasted.last.end = end;
        let x_prev, cov_prev;
        if (start === current) {
            if (current < 2) {
                x_prev = this.init.x;
                cov_prev = this.init.cov;
            }
            else {
                x_prev = __classPrivateFieldGet(this, _state).filtered.x[current - 1];
                cov_prev = __classPrivateFieldGet(this, _state).filtered.cov[current - 1];
            }
        }
        else {
            x_prev = __classPrivateFieldGet(this, _state).forecasted.x[start - current - 1];
            cov_prev = __classPrivateFieldGet(this, _state).forecasted.cov[start - current - 1];
        }
        for (let i = start; i < end; i++) {
            const x = this.F.product(x_prev);
            const cov = index_1.products(this.F, cov_prev, this._FT).ope("+", this._GQGT);
            __classPrivateFieldGet(this, _state).forecasted.x.push(x);
            __classPrivateFieldGet(this, _state).forecasted.cov.push(cov);
            x_prev = x;
            cov_prev = cov;
        }
    }
    update(y) {
        const observed = Array.isArray(y)
            ? new index_1.Vector(y)
            : typeof y === "number"
                ? new index_1.Vector([y])
                : null;
        if (observed && observed.values.length !== this.size.y)
            throw new TypeError(`y dim doesn't match.`);
        __classPrivateFieldGet(this, _observed).push(observed);
        this.estimate();
        this.filtering(observed);
    }
    y(props) {
        const { start, end, index } = Object.assign({}, props);
        const observed = __classPrivateFieldGet(this, _observed);
        let startIndex = typeof start === "number" ? start : 0;
        let endIndex = typeof end === "number" ? end : this.current();
        if (startIndex < 0)
            startIndex = 0;
        if (endIndex > this.current())
            endIndex = this.current();
        if (endIndex <= startIndex)
            return [];
        let selectIndex = -1;
        if (typeof index === "number") {
            if (index < 0)
                selectIndex = 0;
            else if (index >= this.size.y)
                selectIndex = this.size.y - 1;
            else
                selectIndex = index;
        }
        const ret = [];
        for (let i = startIndex; i < endIndex; i++) {
            const item = observed[i];
            if (index_1.Vector.isVector(item)) {
                const arr = item.toArray();
                if (selectIndex < 0)
                    ret.push(arr);
                else
                    ret.push(arr[selectIndex]);
            }
            else {
                ret.push(null);
            }
        }
        return ret;
    }
    x(props) {
        const { start, end, type, index } = Object.assign({}, props);
        const current = this.current();
        const stateType = isStateType(type) ? type : "filtered";
        let startIndex = typeof start !== "undefined" ? start : 0;
        let endIndex = typeof end !== "undefined" ? end : current;
        if (startIndex < 0)
            startIndex = 0;
        if (endIndex <= startIndex)
            return [];
        if (type === "smoothed") {
            this.smooth();
        }
        const state = __classPrivateFieldGet(this, _state)[stateType].x;
        let selectIndex = -1;
        if (typeof index === "number") {
            if (index < 0)
                selectIndex = 0;
            else if (index >= this.size.x)
                selectIndex = this.size.x - 1;
            else
                selectIndex = index;
        }
        const ret = [];
        const loopLength = current < endIndex ? current : endIndex;
        for (let i = startIndex; i < loopLength; i++) {
            const arr = state[i].toArray();
            if (selectIndex < 0)
                ret.push(arr);
            else
                ret.push(arr[selectIndex]);
        }
        if (current < endIndex) {
            this.forecast(endIndex);
            __classPrivateFieldGet(this, _state).forecasted.x.slice(0, endIndex - current).forEach((v) => {
                ret.push(v.toArray());
            });
        }
        return ret;
    }
    cov(props) {
        const { start, end, type, index } = Object.assign({}, props);
        const current = this.current();
        const stateType = type ? type : "filtered";
        let startIndex = typeof start === "number" ? start : 0;
        let endIndex = typeof end === "number" ? end : current;
        if (startIndex < 0)
            startIndex = 0;
        if (endIndex < startIndex)
            endIndex = startIndex;
        if (type === "smoothed") {
            this.smooth();
        }
        const cov = __classPrivateFieldGet(this, _state)[stateType].cov;
        let selectRow = -1, selectCol = -1;
        if (typeof index === "number") {
            if (index < 0) {
                selectRow = 0;
                selectCol = 0;
            }
            else if (index >= this.size.x) {
                selectRow = this.size.x - 1;
                selectCol = this.size.x - 1;
            }
            else {
                selectRow = index;
                selectCol = index;
            }
        }
        else if (Array.isArray(index)) {
            const [row, col] = index;
            if (typeof row === "number") {
                if (row < 0)
                    selectRow = 0;
                else if (row >= this.size.x)
                    selectRow = this.size.x - 1;
                else
                    selectRow = row;
            }
            if (typeof col === "number") {
                if (col < 0)
                    selectCol = 0;
                else if (col >= this.size.x)
                    selectCol = this.size.x - 1;
                else
                    selectCol = col;
            }
        }
        const ret = [];
        const loopLength = current < endIndex ? current : endIndex;
        for (let i = startIndex; i < loopLength; i++) {
            const item = cov[i];
            const arr = item.toArray();
            if (selectRow < 0 || selectCol < 0)
                ret.push(arr);
            else
                ret.push(arr[selectRow][selectCol]);
        }
        if (current < endIndex) {
            this.forecast(endIndex);
            __classPrivateFieldGet(this, _state).forecasted.cov.slice(0, endIndex - current).forEach((v) => {
                ret.push(v.toArray());
            });
        }
        return ret;
    }
    likelihood() {
        const xs = __classPrivateFieldGet(this, _state).estimated.x;
        const covs = __classPrivateFieldGet(this, _state).estimated.cov;
        const ys = __classPrivateFieldGet(this, _observed);
        const current = this.current();
        let ret = 0;
        for (let i = 0; i < current; i++) {
            const F = index_1.sum(this.R, index_1.products(this.H, covs[i], this._HT));
            const d = ys[i].ope("-", index_1.products(this.H, xs[i]));
            ret +=
                Math.log(F.det()) + index_1.products(d, F.inv(), d).values[0][0];
        }
        return -0.5 * ret;
    }
}
_observed = new WeakMap(), _state = new WeakMap();
exports.default = Linear;
