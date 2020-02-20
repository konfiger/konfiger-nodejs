
const Konfiger = require("../src/io/github/thecarisma/Konfiger.js")

var konfiger = Konfiger.fromFile('test/test.config.ini', true)
for (var i = 0; i < Konfiger.MAX_CAPACITY + 2; i++) {
    konfiger.put("At-" + i, i)
}