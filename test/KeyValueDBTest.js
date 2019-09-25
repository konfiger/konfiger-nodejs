const KeyValueDB = require("../src/com/azeezadewale/KeyValueDB.js");
const KeyValueObject = require("../src/com/azeezadewale/KeyValueObject.js");

var keyValueDB = new KeyValueDB("One=Adewale\r\nThrees=3333\n", true, '=', '\n', false);
for (var kvo of keyValueDB) {
	console.log('$' + kvo);
};
console.log();

console.log('' + keyValueDB.get("Greeting"));
keyValueDB.set("Greeting", "Hello from Azeez Adewale");
keyValueDB.add("One", "Added another one element");
keyValueDB.add("Null", "Remove this");
console.log('' + keyValueDB.getLike("Three"));

console.log();
for (var kvo of keyValueDB) {
	console.log('$' + kvo);
};
console.log();
console.log('Removed: ' + keyValueDB.remove("Null"));

console.log('' + keyValueDB);
console.log();
keyValueDB.add("Two", "Added another two element");
console.log('' + keyValueDB);
console.log();
keyValueDB.add("Three", "Added another three element");
console.log('' + keyValueDB);
console.log();