
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

var konfiger = Konfiger.fromString(`
Greet=\tHello\nWorld
Name===Adewale Azeez
Occupation=Software Engineer
Location=Nigeria
`, true)
//konfiger.putString("Greet", "\tHello\nWorld")

//var konfiger = Konfiger.fromFile('test/test.txt', true)

console.log(konfiger.toString())