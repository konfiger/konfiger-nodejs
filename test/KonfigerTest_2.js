
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerObject = require("../src/io/github/thecarisma/KonfigerObject.js")

var konfiger = Konfiger.fromFile('test/test.config.ini', true)
konfiger.setSeperator('-')
konfiger.setDelimeter('+')

console.log(konfiger.getSeperator())
console.log(konfiger.getDelimeter())