"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.show = void 0;
const utils_1 = require("./utils");
const d3_1 = require("d3");
function randomStr(length = 8) {
    const cs = "abcdefghijklmnopqrstuvwxyz0123456789";
    let ret = "";
    for (let i = 0; i < length; i++) {
        ret += cs[Math.floor(Math.random() * cs.length)];
    }
    return ret;
}
const show = function (kalmanfilter, elm, options) {
    const { width, height, margin, resize, observed, state, variance, type, start, end, min, max, ticks, unit, colors, } = options;
    const svgWidth = width && width > 0 ? width : 720;
    const svgHeight = height && height > 0 ? height : 520;
    const marginLeft = (margin === null || margin === void 0 ? void 0 : margin.left) && margin.left > 0 ? margin.left : 60;
    const marginRight = (margin === null || margin === void 0 ? void 0 : margin.right) && margin.right > 0 ? margin.right : 30;
    const marginTop = (margin === null || margin === void 0 ? void 0 : margin.top) && margin.top > 0 ? margin.top : 30;
    const marginBottom = (margin === null || margin === void 0 ? void 0 : margin.bottom) && margin.bottom > 0 ? margin.bottom : 30;
    const innerWidth = svgWidth - marginLeft - marginRight;
    const innerHeight = svgHeight - marginTop - marginBottom;
    const startIndex = typeof start !== "undefined" && start > 0 ? Math.floor(start) : 0;
    const endIndex = typeof end !== "undefined" && startIndex < end
        ? Math.floor(end)
        : kalmanfilter.current();
    const observedIndexArr = Array.isArray(observed) ? observed : [];
    const stateIndexArr = Array.isArray(state) ? state : [0];
    const varianceIndexArr = Array.isArray(variance) ? variance : [false];
    const graphColors = Array.isArray(colors) ? colors : d3_1.schemeSet1;
    const svg = d3_1.select(elm).append("svg");
    if (resize)
        svg.attr("viewBox", [0, 0, svgWidth, svgHeight].toString());
    else
        svg.attr("width", svgWidth).attr("height", svgHeight);
    const uid = randomStr();
    const clipId = "kf_clip_" + uid;
    const circleRadius = 4;
    const circleStrokeWidth = 2;
    const frame = svg
        .append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
    frame
        .append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", -(circleRadius + circleStrokeWidth))
        .attr("y", 0)
        .attr("width", innerWidth + 2 * (circleRadius + circleStrokeWidth))
        .attr("height", innerHeight);
    let observedValues = [];
    if (observedIndexArr.length > 0) {
        observedValues = kalmanfilter.y({
            start: startIndex,
            end: endIndex,
        });
    }
    let stateValues = [];
    if (stateIndexArr.length > 0) {
        stateValues = kalmanfilter.x({
            start: startIndex,
            end: endIndex,
            type,
        });
    }
    let covValues = [];
    if (varianceIndexArr.length > 0) {
        covValues = kalmanfilter.cov({
            start: startIndex,
            end: endIndex,
            type,
        });
    }
    const data = [];
    let minY = 0, maxY = 0;
    for (let step = 0; step < endIndex - startIndex; step++) {
        const item = {
            step: step + startIndex,
            observed: [],
            state: [],
            upper: [],
            lower: [],
        };
        if (Array.isArray(observedValues[step])) {
            observedIndexArr.forEach((index) => {
                const y = observedValues[step][index];
                if (typeof y !== "undefined") {
                    item.observed.push(y);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            });
        }
        else {
            item.observed.push(null);
        }
        if (typeof stateValues[step] !== "undefined") {
            for (const [index, area] of utils_1.zip(stateIndexArr, varianceIndexArr)) {
                const x = stateValues[step][index];
                if (typeof x !== "undefined") {
                    item.state.push(x);
                    if (area) {
                        const v2 = covValues[step][index][index];
                        if (typeof v2 !== "undefined") {
                            item.upper.push(x + 1.96 * Math.pow(v2, 0.5));
                            item.lower.push(x - 1.96 * Math.pow(v2, 0.5));
                        }
                    }
                }
            }
            if (item.upper.length > 0) {
                maxY = Math.max(maxY, ...item.upper);
            }
            else {
                maxY = Math.max(maxY, ...item.state);
            }
            if (item.lower.length > 0) {
                minY = Math.min(minY, ...item.lower);
            }
            else {
                minY = Math.min(minY, ...item.state);
            }
        }
        data.push(item);
    }
    const yRange = [];
    if (typeof min !== "undefined" && typeof max !== "undefined") {
        yRange[0] = min;
        yRange[1] = max;
    }
    else if (typeof min !== "undefined") {
        yRange[0] = min;
        yRange[1] = maxY + (maxY - min) * 0.1;
    }
    else if (typeof max !== "undefined") {
        yRange[0] = minY - (max - minY) * 0.1;
        yRange[1] = max;
    }
    else {
        yRange[0] = minY - (maxY - minY) * 0.1;
        yRange[1] = maxY + (maxY - minY) * 0.1;
    }
    if (yRange[0] > yRange[1]) {
        yRange[0] = minY - (maxY - minY) * 0.1;
        yRange[1] = maxY + (maxY - minY) * 0.1;
    }
    const xScale = d3_1.scaleLinear()
        .domain([startIndex, endIndex - 1])
        .range([0, innerWidth]);
    const tickCount = endIndex - startIndex + 1;
    const tickSpace = tickCount > 10 ? Math.round(tickCount / 10) : 1;
    frame
        .append("g")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3_1.axisBottom(xScale)
        .tickValues(Array.from(utils_1.range(startIndex, endIndex)).filter((d, i) => {
        return (d - startIndex) % tickSpace === 0;
    }))
        .tickFormat(function (d, i) {
        const value = d.valueOf();
        if (!ticks) {
            return String(value);
        }
        else if (ticks[value])
            return String(ticks[value]);
        else
            return "";
    }));
    const yScale = d3_1.scaleLinear().domain(yRange).range([innerHeight, 0]);
    frame.append("g").call(d3_1.axisLeft(yScale));
    for (let i = 0; i < observedIndexArr.length; i++) {
        frame
            .append("g")
            .selectAll("dot")
            .data(data.filter((d) => {
            const v = d.observed[observedIndexArr[i]];
            return v !== null && !isNaN(v);
        }))
            .enter()
            .append("circle")
            .attr("clip-path", `url(#${clipId})`)
            .attr("cy", function (d, j) {
            const v = d.observed[observedIndexArr[i]];
            return v !== null ? yScale(v) : 0;
        })
            .attr("cx", function (d) {
            return xScale(d.step);
        })
            .attr("r", circleRadius)
            .attr("fill-opacity", "0")
            .attr("stroke-width", circleStrokeWidth)
            .style("stroke", graphColors[i % graphColors.length]);
    }
    for (let i = 0; i < stateIndexArr.length; i++) {
        if (varianceIndexArr[i])
            frame
                .append("path")
                .attr("clip-path", `url(#${clipId})`)
                .datum(data)
                .attr("fill", graphColors[(i + observedIndexArr.length) % graphColors.length])
                .attr("fill-opacity", 0.25)
                .attr("stroke", "none")
                .attr("d", d3_1.area()
                .x(function (d) {
                return xScale(d.step);
            })
                .y0(function (d) {
                return yScale(d.lower[stateIndexArr[i]]);
            })
                .y1(function (d) {
                return yScale(d.upper[stateIndexArr[i]]);
            }));
        frame
            .append("path")
            .attr("clip-path", `url(#${clipId})`)
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", graphColors[(i + observedIndexArr.length) % graphColors.length])
            .attr("stroke-width", 1.5)
            .attr("d", d3_1.line()
            .x(function (d) {
            return xScale(d.step);
        })
            .y(function (d) {
            return yScale(d.state[stateIndexArr[i]]);
        }));
    }
    let legendGutter = [0, 0];
    if (unit) {
        frame
            .append("text")
            .attr("x", 8)
            .attr("y", 2)
            .text(unit)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");
        legendGutter = [2, 16];
    }
    const legend = frame.append("g");
    const observedLegends = observedIndexArr.map((order, index) => {
        return {
            label: `observed[${order}]`,
            color: graphColors[index % graphColors.length],
        };
    });
    const stateLegends = stateIndexArr.map((order, index) => {
        return {
            label: `state[${order}]`,
            color: graphColors[(index + observedIndexArr.length) % graphColors.length],
        };
    });
    observedLegends.forEach((d, i) => {
        legend
            .append("circle")
            .attr("cx", 12 + legendGutter[0])
            .attr("cy", 14 * i + legendGutter[1])
            .attr("r", 4)
            .attr("fill", "#fff")
            .attr("stroke-width", 2)
            .style("stroke", d.color);
        legend
            .append("text")
            .attr("x", 20 + legendGutter[0])
            .attr("y", 14 * i + 1 + legendGutter[1])
            .text(d.label)
            .style("font-size", "10px")
            .attr("alignment-baseline", "middle");
    });
    stateLegends.forEach((d, i) => {
        legend
            .append("rect")
            .attr("x", 12 + legendGutter[0] - 4)
            .attr("y", 14 * (i + observedLegends.length) - 4 + legendGutter[1])
            .attr("width", 8)
            .attr("height", 8)
            .style("fill", d.color);
        legend
            .append("text")
            .attr("x", 20 + legendGutter[0])
            .attr("y", 14 * (i + observedLegends.length) + 1 + legendGutter[1])
            .text(d.label)
            .style("font-size", "10px")
            .attr("alignment-baseline", "middle");
    });
};
exports.show = show;
