const KonfigerUtil = require("../src/io/github/thecarisma/KonfigerUtil.js");

const desperate = [ 'one' ];

console.log("\t\tHello World")
console.log(KonfigerUtil.escapeString("\t\tHello World"))

console.log()
console.log("typeOf:    " + KonfigerUtil.typeOf(desperate[1]));
console.log("typeOf:    " + KonfigerUtil.typeOf(desperate[0]));
console.log("typeOf:    " + KonfigerUtil.typeOf(desperate));
console.log("typeOf:    " + KonfigerUtil.typeOf("Hello World"));
console.log("typeOf:    " + KonfigerUtil.typeOf(44343));
console.log("typeOf:    " + KonfigerUtil.typeOf(true));
console.log("typeOf:    " + KonfigerUtil.typeOf('a'));

console.log()
console.log("isDefined: " + KonfigerUtil.isDefined(desperate[1]));
console.log("isDefined: " + KonfigerUtil.isDefined(desperate[0]));

console.log()
console.log("isString:  " + KonfigerUtil.isString('Hello World'));
console.log("isString:  " + KonfigerUtil.isString(30));

console.log()
console.log("isNumber:  " + KonfigerUtil.isNumber('Hello World'));
console.log("isNumber:  " + KonfigerUtil.isNumber(30)); 

console.log()
console.log("isObject:  " + KonfigerUtil.isObject('Hello World'));
console.log("isObject:  " + KonfigerUtil.isObject(desperate)); 

console.log()
console.log("isChar:    " + KonfigerUtil.isChar('Hello World'));
console.log("isChar:    " + KonfigerUtil.isChar('a')); 

console.log()
console.log("isBoolean: " + KonfigerUtil.isBoolean(true));
console.log("isBoolean: " + KonfigerUtil.isBoolean(false)); 
console.log("isBoolean: " + KonfigerUtil.isBoolean(2)); 
