
const { Konfiger } = require("../index.js")
const KonfigerUtil = require("../src/io/github/thecarisma/KonfigerUtil.js")
const { performance } = require('perf_hooks');

let times = 99999999999

console.log(`===================
Without Cache
===================`)

var konfiger1 = Konfiger.fromFile('test/test.config.ini', true)
konfiger1.enableCache(false)

var t0 = performance.now()
for (var i = 0; i < times; ++i) {
    konfiger1.get("Location")
}
var t1 = performance.now();
console.log("Konfiger Get call took " + millisToMinutesAndSeconds(t1 - t0) + " minutes. After " + i + " calls");

console.log(`\n===================
With Cache
===================`)

var konfiger1 = Konfiger.fromFile('test/test.config.ini', true)
konfiger1.enableCache(true)

var t0 = performance.now()
for (var i = 0; i < times; ++i) {
    konfiger1.get("Location")
}
var t1 = performance.now();
console.log("Konfiger Get call took " + millisToMinutesAndSeconds(t1 - t0) + " minutes. After " + i + " calls");

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}