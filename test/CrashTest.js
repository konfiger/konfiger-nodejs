
const { KonfigerStream } = require("../index.js")

var kStream = new KonfigerStream('test/test.txt')
while (true) {
    let entry = kStream.next()
    console.log(entry)
}