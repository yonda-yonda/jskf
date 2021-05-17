"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = exports.zip = void 0;
function* zip(...args) {
    const iterators = args.map((i) => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map((i) => i.next());
        if (results.some(({ done }) => done)) {
            break;
        }
        yield results.map(({ value }) => value);
    }
}
exports.zip = zip;
function* range(...args) {
    let start = 0, end, step = 1;
    if (args.length < 2)
        end = args[0];
    else {
        start = args[0];
        end = args[1];
    }
    if (args.length >= 3)
        step = args[2];
    for (let i = start; i < end; i += step) {
        yield i;
    }
}
exports.range = range;
