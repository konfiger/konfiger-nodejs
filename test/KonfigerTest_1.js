
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

var konfiger = Konfiger.fromFile('test/test.config.ini')
konfiger.put("One", konfiger)
konfiger.putLong("Two", 123456789)


console.log(konfiger.get("Two", "Default Value"))

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
console.log()

