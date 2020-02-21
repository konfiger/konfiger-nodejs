
const { Konfiger } = require("../index.js")

var konfiger = Konfiger.fromFile('test/test.config.ini', true)
konfiger.setSeperator('-')
konfiger.setDelimeter('+')

console.log(konfiger.getSeperator())
console.log(konfiger.getDelimeter())