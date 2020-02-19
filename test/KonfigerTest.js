
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerObject = require("../src/io/github/thecarisma/KonfigerObject.js")

console.log(Konfiger.MAX_CAPACITY)

var konfiger = Konfiger.fromFile('test/test.config.ini')
konfiger.put("One", konfiger)
konfiger.put("Two", new KonfigerObject("hello", "world"))
konfiger.put("Two", new KonfigerObject("hello", "world"))
konfiger.put("Three", 3)
console.log(true.toString())
console.log(konfiger.get("One"))
console.log(konfiger.get("Two"))
/*for (var o of konfiger) {
    
}*/