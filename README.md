# jskf

Kalman fileter for Javascript.

(now only Linear equation of state)

## sample

### basic

```Javascript
const kf = new jskf.Linear({
  F: 1,
  G: 1,
  H: 1,
  Q: 1000,
  R: 10000,
  init: {
    cov: [[1000]],
  },
  y: data,
});

console.log(kf.x());
console.log(kf.x({type:"smoothed"}));
console.log(kf.cov({start: 10, end: 20}));
```

### plot

```Javascript
jskf.plot.show(kf, document.getElementById("graph1"), {
  observed: [0],
  state: [0],
  min: 0,
  start: 0,
  end: 120,
  variance: [true]
});
```

### optimize

```Javascript
function f(params: number[]) {
  const kf = new Linear({
    F: 1,
    G: 1,
    H: 1,
    Q: params[0],
    R: params[1],
    y: nile,
  });
  return -1 * kf.likelihood();
}

const [optimized, minimumValue, iter, success] = minimize(f, [1000, 1000]);
```
