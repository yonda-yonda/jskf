"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimize = void 0;
const nelder_mead_1 = require("./nelder-mead");
function minimize(f, x0, options) {
    return nelder_mead_1.nelderMead(f, x0, options);
}
exports.minimize = minimize;
