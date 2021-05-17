"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = exports.sum = exports.Matrix = exports.Vector = void 0;
const vector_1 = __importDefault(require("./vector"));
exports.Vector = vector_1.default;
const matrix_1 = __importDefault(require("./matrix"));
exports.Matrix = matrix_1.default;
function sum(...args) {
    if (args.length < 1)
        throw new Error("Nothing arguments.");
    let ret;
    ret = args[0].copy();
    const values = args.slice(1);
    values.forEach((v) => {
        if (v.constructor.name !== ret.constructor.name)
            throw new Error("Don't match arguments class.");
        ret = ret.ope("+", v);
    });
    return ret;
}
exports.sum = sum;
function products(...args) {
    if (args.length < 1)
        throw new Error("Nothing arguments.");
    let ret = args[0].copy();
    const values = args.slice(1);
    values.forEach((v) => {
        ret = ret.product(v);
    });
    return ret;
}
exports.products = products;
