const Konfiger = require("../src/io/github/thecarisma/Konfiger.js");

console.log(Konfiger.MAX_CAPACITY)

var konfiger = Konfiger.fromFile()
console.log(konfiger.text)