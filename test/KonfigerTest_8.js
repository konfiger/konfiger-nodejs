
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

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
console.log(konfiger.toString())