'use strict';

const PI2 = Math.PI*2;

function hanming(n, N) {
    return 0.54 - 0.46*Math.cos(PI2*n / (N-1));
}

function WindowFn(size, windowFn) {
    this.size = size;
    this.windowFn = windowFn | hanming;
    this.raw = new Array(size).fill(0);
    this.windowed = new Array(size).fill(0);
    this.window = new Array(size).fill(0);

    for (let i=0; i<this.window.length; i++) {
        this.window[i] = this.windowFn(i, this.window.length);
    }
}
module.exports = WindowFn;

WindowFn.prototype.computeWindowed = () => {
    for (let i=0; i<this.raw.length; i++) {
        this.windowed[i] = this.window[i]*this.raw[i];
    }
    return this.windowed
}
