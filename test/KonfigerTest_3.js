
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerObject = require("../src/io/github/thecarisma/KonfigerObject.js")

var konfiger = Konfiger.fromFile('test/test.config.ini')
konfiger.putString("Greet", "\tHello \tWorld")
konfiger.putLong("Long", 245134535524372)
konfiger.putString("Last", "Hello every one \bStart again")

console.log(konfiger.toString())