
const { Konfiger } = require("../index.js")

var konfiger = Konfiger.fromFile('test/test.config.ini', true)

console.log(konfiger.toString())
console.log()
konfiger.appendString(`
Language=English
`)
konfiger.appendFile('test/test.txt')
console.log(konfiger.toString())

for (entry of konfiger.entries()) {
    console.log(entry)
}