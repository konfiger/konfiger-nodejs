
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

var ks = new KonfigerStream('test/test.config.ini', '=', '\n')
while (ks.hasNext()) {
    console.log(ks.next())
}