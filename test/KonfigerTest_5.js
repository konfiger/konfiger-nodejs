
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerObject = require("../src/io/github/thecarisma/KonfigerObject.js")

var konfiger = Konfiger.fromFile(`
Name=Adewale Azeez
Occupation=Software Engineer
Location=Nigeria
`, false)
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