
const { Konfiger } = require("../index.js")

let konfiger = Konfiger.fromFile('test/test.txt', //the file pth
                                true //lazyLoad true
                                )
//at this point nothing is read from the file

//the size of konfiger is 0 even if the file contains over 1000 entries
console.log(konfiger.size())

//the key 'Twos' is at the second line in the file, therefore two entry has 
//been read to get the value.
console.log(konfiger.get("Twos"))

//the size becomes 2, 
console.log(konfiger.size())

//to read all the entries simple call the toString() method
console.log(konfiger.toString())

//now the size is equal to the entry
console.log(konfiger.size())