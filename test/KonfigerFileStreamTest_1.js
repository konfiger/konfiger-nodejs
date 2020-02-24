
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

var ks = KonfigerStream.fileStream('test/test.txt', '=', '\n')
while (ks.hasNext()) {
    console.log(ks.next())
}