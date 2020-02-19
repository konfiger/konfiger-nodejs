
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerObject = require("../src/io/github/thecarisma/KonfigerObject.js")

console.log(Konfiger.MAX_CAPACITY)

var konfiger = Konfiger.fromFile('test/test.config.ini')
konfiger.put("One", konfiger)
konfiger.put("Two", new KonfigerObject("hello", "world"))

for (var o of konfiger) {
    console.log(o.value)
}