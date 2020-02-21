
const { Konfiger } = require("../index.js")

var konfiger = Konfiger.fromString(`
Name=Adewale Azeez
Occupation=Software Engineer
Location=Nigeria
`, true)
konfiger.putString("Greet", "\tHello \tWorld")
konfiger.putLong("Long", 245134535524372)
konfiger.putString("Last", "Hello every one \rStart again")
konfiger.putString("And", "This should go \non a new line")
console.log(konfiger.getString("Name"))

console.log(konfiger.toString())
console.log()
console.log(konfiger.hashCode())
console.log(konfiger.getString("Last"))
console.log(konfiger.getString("And"))