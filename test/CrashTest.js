
const { Konfiger } = require("../index.js")

let konfiger = Konfiger.fromString(`Ones:11111111111,Twos:2222222222222`, 
                                false, 
                                ':',
                                ',')

//to read all the entries simple call the toString() method
console.log(konfiger.toString())

//now the size is equal to the entry
console.log(konfiger.size())
