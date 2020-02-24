
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

try {
    var ks = KonfigerStream.fileStream()
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = KonfigerStream.fileStream(20)
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = KonfigerStream.fileStream("./tryer.ini")
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = KonfigerStream.fileStream("./index.js")
    console.log("file path validated successfully")
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = KonfigerStream.fileStream("./index.js", ',')
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = KonfigerStream.fileStream("./index.js", ',', '==')
} catch (err) { console.log("Error: " + err.message) }

try {
    var ks = KonfigerStream.stringStream(30)
} catch (err) { console.log("Error: " + err.message) }