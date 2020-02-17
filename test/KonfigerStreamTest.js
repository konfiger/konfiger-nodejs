
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

try {
    var ks = new KonfigerStream()
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = new KonfigerStream(20)
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = new KonfigerStream("./tryer.ini")
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = new KonfigerStream("./index.js")
    console.log("file path validated successfully")
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = new KonfigerStream("./index.js", ',')
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = new KonfigerStream("./index.js", ',', '==')
} catch (err) { console.log("Error: " + err.message) }