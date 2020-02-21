
const { Konfiger } = require("../index.js")

console.log(Konfiger.MAX_CAPACITY)

var konfiger = Konfiger.fromFile('test/test.config.ini', true)
konfiger.put("One", konfiger)
konfiger.put("Two", `"hello", "world"`)
konfiger.putString("Two", "hello world")
konfiger.put("Three", 3)
konfiger.putInt("Four", 4)
konfiger.putBoolean("Five", true)
konfiger.put("Six", false)
konfiger.put("Seven", 121251656.1367367263726)
konfiger.putFloat("Eight", 0.21)


console.log(konfiger.get("One"))
console.log(konfiger.get("Two"))
console.log(konfiger.get("Three"))
console.log(konfiger.get("Four"))
console.log(konfiger.get("Five"))
console.log(konfiger.get("Six"))
console.log(konfiger.get("Seven"))
console.log(konfiger.get("Eight"))
/*for (var o of konfiger) {
    
}*/