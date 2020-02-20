const KonfigerUtil = require("../src/io/github/thecarisma/KonfigerUtil.js");

const desperate = [ 'one' ];
var t1 = KonfigerUtil.escapeString(`Hello¬W\n-\t-\torld`, ['¬'])

console.log(t1)
console.log(KonfigerUtil.unEscapeString(t1, ['¬']))
