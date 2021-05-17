"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nelderMead = void 0;
const centroid = (points, h = -1) => {
    const size = points[0].length;
    const ret = [];
    for (let i = 0; i < size; i++) {
        ret[i] = 0;
    }
    let n = 0;
    for (let i = 0; i < points.length; i++) {
        if (i !== h) {
            n += 1;
            for (let j = 0; j < ret.length; j++) {
                ret[j] += points[i][j];
            }
        }
    }
    for (let i = 0; i < ret.length; i++) {
        ret[i] /= n;
    }
    return ret;
};
const sortOrder = (arr) => {
    const sorted = arr
        .map((v, i) => {
        return [v, i];
    })
        .sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0;
    });
    return sorted.map((vi) => {
        return vi[1];
    });
};
// http://ar.nyx.link/min/
// https://www.webpages.uidaho.edu/~fuchang/res/ANMS.pdf
const nelderMead = function (f, x0, options) {
    const { maxIteration, eps } = Object.assign({
        maxIteration: 100000,
        eps: 1.0e-8,
    }, options);
    const n = x0.length;
    if (n < 1)
        throw new Error("x0's length must be at least one.");
    const alpha = 1.0;
    const beta = n < 3 ? 2 : 1.0 + 2 / n;
    const gamma = n < 3 ? 0.5 : 0.75 - 0.5 / n;
    const sigma = n < 3 ? 0.5 : 1.0 - 1 / n;
    const points = [x0];
    const fs = [f(x0)];
    for (let i = 0; i < n; i++) {
        const x = [];
        const tau = Math.abs(x0[i]) < 1.0e-8 ? 0.00025 : 0.05;
        for (let j = 0; j < n; j++) {
            x[j] = j === i ? x0[j] + tau : x0[j];
        }
        points.push(x);
        fs.push(f(x));
    }
    let orders = sortOrder(fs), iteration = 0;
    while (iteration < maxIteration) {
        let store = null;
        const c = centroid(points, orders[orders.length - 1]), u1 = orders[orders.length - 1], xu1 = points[u1], fu1 = fs[u1], u2 = orders[orders.length - 2], fu2 = fs[u2], l = orders[0], xl = points[l], fl = fs[l];
        //Relection
        const xr = [];
        for (let i = 0; i < n; i++) {
            xr.push(c[i] + alpha * (c[i] - xu1[i]));
        }
        const fr = f(xr);
        if (fr < fl) {
            //Expansion
            const xe = [];
            for (let i = 0; i < n; i++) {
                xe.push(c[i] + beta * (xr[i] - c[i]));
            }
            const fe = f(xe);
            if (fe < fr) {
                store = [xe, fe];
            }
            else {
                store = [xr, fr];
            }
        }
        else if (fr < fu2) {
            store = [xr, fr];
        }
        else {
            //Contraction
            const xc = [];
            if (fr < fu1) {
                //Outside
                for (let i = 0; i < n; i++) {
                    xc.push(c[i] + gamma * (xr[i] - c[i]));
                }
                const fc = f(xc);
                if (fc <= fr) {
                    store = [xc, fc];
                }
            }
            else {
                //Inside
                for (let i = 0; i < n; i++) {
                    xc.push(c[i] - gamma * (xr[i] - c[i]));
                }
                const fc = f(xc);
                if (fc < fu1) {
                    store = [xc, fc];
                }
            }
            if (!store) {
                //Shrink
                for (let i = 1; i < n + 1; i++) {
                    const o = orders[i];
                    const xi = [];
                    for (let j = 0; j < n; j++) {
                        xi[j] = xl[j] + sigma * (points[o][j] - xl[j]);
                    }
                    points[o] = xi;
                    fs[o] = f(xi);
                }
            }
        }
        if (store) {
            const [x, fvalue] = store;
            points[u1] = x;
            fs[u1] = fvalue;
        }
        orders = sortOrder(fs);
        let done = true;
        const center = centroid(points);
        for (let i = 0; i < n + 1; i++) {
            for (let j = 0; j < n; j++) {
                if (Math.abs(points[i][j] - center[j]) > eps) {
                    done = false;
                    break;
                }
            }
        }
        if (done)
            break;
        iteration += 1;
    }
    const center = centroid(points);
    const fc = f(center);
    if (fc < fs[orders[0]]) {
        return [center, fc, iteration, iteration < maxIteration];
    }
    return [
        points[orders[0]],
        fs[orders[0]],
        iteration,
        iteration < maxIteration,
    ];
};
exports.nelderMead = nelderMead;
