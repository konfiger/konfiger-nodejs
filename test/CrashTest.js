
const { Konfiger } = require("../index.js")

//initialize the key-value from file
var konfiger = Konfiger.fromFile('test/test.config.ini', true)

//add a string
konfiger.putString("Greet", "Hello Worlrd")

//get an object
console.log(konfiger.get("Greet"))

//remove an object
konfiger.remove("Greet")

//add an String
konfiger.putString("What", "i don't know what to write here");

//print all the objects
for (var entry of konfiger.entries()) {
	console.log(entry)
}