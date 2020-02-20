
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")
const KonfigerUtil = require("../src/io/github/thecarisma/KonfigerUtil.js")

var konfiger = Konfiger.fromFile('test/test.config.ini', true)
konfiger.put("One", konfiger)
konfiger.putLong("Two", 123456789)
konfiger.putBoolean("Bool", true)
konfiger.putFloat("Float", 123.56)
konfiger.putString("Dummy", "Noooooo 1")
konfiger.putString("Dummy2", "Noooooo 1")


console.log("=====================================")
console.log(konfiger.get("Two"))
console.log("IsString: " + KonfigerUtil.isString(konfiger.get("Two")))
console.log("IsNumber: " + KonfigerUtil.isNumber(konfiger.getLong("Two")))
console.log("IsString: " + KonfigerUtil.isString(konfiger.getLong("Two")))
console.log("=====================================")
console.log(konfiger.get("Bool"))
console.log("IsString: " + KonfigerUtil.isString(konfiger.get("Bool")))
console.log("IsBoolean: " + KonfigerUtil.isBoolean(konfiger.getBoolean("Bool")))
console.log("IsString: " + KonfigerUtil.isString(konfiger.getBoolean("Bool")))
console.log("=====================================")
console.log(konfiger.get("Float"))
console.log("IsString: " + KonfigerUtil.isString(konfiger.get("Float")))
console.log("IsFloat: " + KonfigerUtil.isFloat(konfiger.getFloat("Float")))
console.log("IsString: " + KonfigerUtil.isString(konfiger.getFloat("Float")))
console.log("=====================================")
console.log(konfiger.get("Three", "Default Value"))

console.log()
console.log("Keys")
for (var en of konfiger.keys()) {
    console.log("\t"+en)
}
console.log()


console.log("Values")
for (var en of konfiger.values()) {
    console.log("\t"+en)
}
console.log()


console.log("Entries")
for (var en of konfiger.entries()) {
    console.log("\t"+en)
}
console.log()

console.log(konfiger.size())
konfiger.remove("Dummy2")
console.log(konfiger.size())
konfiger.remove(konfiger.size() - 1)
console.log(konfiger.size())
console.log()

