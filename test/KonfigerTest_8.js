
const { Konfiger } = require("../index.js")

var konfiger = Konfiger.fromString(`
Name=Adewale Azeez
Occupation=Software Engineer
Location=Nigeria
`, true)

console.log(konfiger.toString())
console.log()
konfiger.appendString(`
Language=English
`)
konfiger.appendFile('test/test.txt')
console.log(konfiger.toString())