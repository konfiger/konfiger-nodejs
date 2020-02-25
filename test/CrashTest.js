
const { KonfigerStream } = require("../index.js")

var kStream = new KonfigerStream.stringStream(`
String=This is a string
Number=215415245
Float=56556.436746
Boolean=true
`, false)

while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}