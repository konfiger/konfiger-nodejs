
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerObject = require("../src/io/github/thecarisma/KonfigerObject.js")

var konfiger = Konfiger.fromFile('test/test.config.ini')
konfiger.putString("Greet", "\tHello \tWorld")
konfiger.putLong("Long", 245134535524372)
konfiger.putString("Last", "Hello every one \rStart again")
console.log(konfiger.getString("Name"))

console.log(konfiger.toString())
console.log()
console.log(konfiger.hashCode())
console.log(konfiger.getString("Last"))