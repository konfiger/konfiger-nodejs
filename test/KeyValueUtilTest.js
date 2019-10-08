const KeyValueUtil = require("../src/dev/sourcerersproject/KeyValueUtil.js");

const desperate = [ 'one' ];

console.log()
console.log("typeOf:    " + KeyValueUtil.typeOf(desperate[1]));
console.log("typeOf:    " + KeyValueUtil.typeOf(desperate[0]));
console.log("typeOf:    " + KeyValueUtil.typeOf(desperate));
console.log("typeOf:    " + KeyValueUtil.typeOf("Hello World"));
console.log("typeOf:    " + KeyValueUtil.typeOf(44343));
console.log("typeOf:    " + KeyValueUtil.typeOf(true));
console.log("typeOf:    " + KeyValueUtil.typeOf('a'));

console.log()
console.log("isDefined: " + KeyValueUtil.isDefined(desperate[1]));
console.log("isDefined: " + KeyValueUtil.isDefined(desperate[0]));

console.log()
console.log("isString:  " + KeyValueUtil.isString('Hello World'));
console.log("isString:  " + KeyValueUtil.isString(30));

console.log()
console.log("isNumber:  " + KeyValueUtil.isNumber('Hello World'));
console.log("isNumber:  " + KeyValueUtil.isNumber(30)); 

console.log()
console.log("isObject:  " + KeyValueUtil.isObject('Hello World'));
console.log("isObject:  " + KeyValueUtil.isObject(desperate)); 

console.log()
console.log("isChar:    " + KeyValueUtil.isChar('Hello World'));
console.log("isChar:    " + KeyValueUtil.isChar('a')); 

console.log()
console.log("isBoolean: " + KeyValueUtil.isBoolean(true));
console.log("isBoolean: " + KeyValueUtil.isBoolean(false)); 
console.log("isBoolean: " + KeyValueUtil.isBoolean(2)); 
