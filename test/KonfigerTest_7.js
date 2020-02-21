
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

var konfiger = Konfiger.fromString(`Name===Adewale AzeezgOccupation=Software En\\gineergGreet=\tHello\nWorldgLocation=Ni\\geria`, false, '=', 'g')
//var konfiger = Konfiger.fromFile('test/test.txt', true, '=', 'g')

konfiger.setSeperator('\n')
konfiger.putString("Greet", `\tHello-      World`)

console.log(konfiger.getString("Location"))
console.log(konfiger.toString())
konfiger.save('test/test.txt')


for (var entry of konfiger.entries()) {
    console.log(entry)
}