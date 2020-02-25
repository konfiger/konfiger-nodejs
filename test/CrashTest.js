
const { Konfiger } = require("../index.js")

var konfiger = Konfiger.fromString(`
String=This is a string
Number=215415245
Float=56556.436746
Boolean=true
`, false)

console.log(konfiger.get("String"))
konfiger.put("String", "This is an updated string")
console.log(konfiger.get("String"))