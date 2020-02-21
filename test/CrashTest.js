
const { KonfigerStream } = require("../index.js")

var kStream = new KonfigerStream('test/konfiger.conf')
while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}