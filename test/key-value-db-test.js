const KeyValueModule = require("../");

var kvo = new KeyValueModule.KeyValueObject("Greetings", "Hello world from Adewale Azeez");
var kvd = new KeyValueModule.KeyValueDB("Name=key-value-db");
kvd.add("version", "1.0.0");
kvd.add("description", "Quick and easy manage, load, update and save key-value type database");
kvd.add("repository_type", "git");
kvd.add("repository_url", "https://github.com/Thecarisma/key-value-db/nodejs/");
kvd.add(kvo);
console.log('' + kvo + '\n');
console.log('' + kvd);

