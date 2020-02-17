
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

try {
    var ks = new KonfigerStream()
    
} catch (err) { console.log("Error: " + err.message) }