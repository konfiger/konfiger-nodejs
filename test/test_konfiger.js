
const assert = require('assert')
const { Konfiger, KonfigerStream } = require("../index.js")


//test prev and current cache
//test putComment
//test the single pair commenting

var kStream = KonfigerStream.stringStream(`
String=This is a string
#Number=215415245
Float=56556.436746
#Boolean=true
`)
kStream.setCommentPrefix("#")

while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}