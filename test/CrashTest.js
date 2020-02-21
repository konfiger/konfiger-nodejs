
const { Konfiger } = require("../index.js")

//initialize the key-value from file
var konfiger = Konfiger.fromFile('test/test.config.ini', true)

//get an object
konfiger.get("Greet")

//remove an object
konfiger.remove("Greet")

//add an String
konfiger.putString("What", "i don't know what to write here");

//print all the objects
for (var entry of konfiger.entries()) {
	console.log(entry)
}