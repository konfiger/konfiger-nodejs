
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

var konfiger = Konfiger.fromString(`Name===Adewale AzeezgOccupation=Software En\\gineergGreet=\tHello\nWorldgLocation=Ni\\geria`, false, '=', 'g')
konfiger.putString("Greet", `\tHello-      World`)

konfiger.setSeperator('g')
//var konfiger = Konfiger.fromFile('test/test.txt', true)

console.log(konfiger.toString())


for (var entry of konfiger.entries()) {
    console.log(entry)
}