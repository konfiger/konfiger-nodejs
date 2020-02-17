
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

try {
    var ks = new KonfigerStream('test/test.config.ini', '=', '\n')
    while (ks.hasNext()) {
        console.log(ks.next())
    }
    
} catch (err) { console.log("Error: " + err.message) }