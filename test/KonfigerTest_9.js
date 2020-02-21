
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

var konfiger = Konfiger.fromFile('test/test.config.ini', true)

console.log(konfiger.toString())
console.log()
konfiger.appendString(`
Language=English
`)
console.log(konfiger.toString())