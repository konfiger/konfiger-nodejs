# <p style="text-align: center;" align="center"><img src="https://github.com/keyvaluedb/key-value-db/raw/master/icons/key-value-db-nodejs.png" alt="key-value-db-nodejs" style="width:300px;height:200px;" width="300" height="200" /><br /> key-value-db-nodejs</p>

<p style="text-align: center;" align="center">Light weight package to quickly and easily manage, load, update and save key-value type database </p>

___

## Table of content
- [Installation](#installation)
- [Example](#example)
- [Legends](#legends)
- [API](#api)
	- [Creating/loading a document](#creating/loading-a-document)
	- [Inserting data](#inserting-data)
	- [Finding data](#finding-data)
	    - [Get KeyValue Object](#get-keyvalue-object)
	    - [Get Like KeyValue Object](#get-like-keyvalue-object)
	    - [Get](#get-like)
	    - [Get Like](#get-like)
	- [Updating data](#updating-data)
        - [Set](#set)
        - [Set KeyValue Object](#set-keyvalue-object)
	- [Inserting data](#inserting-data)
	- [Removing data](#removing-data)
- [Contributing](#contributing)
- [License](#license)

## Installation

Module name on npm and bower is @thecarisma/key-value-db.

Using npm:

```bash
$ npm install @thecarisma/key-value-db
```

Using bower:

```bash
bower install @thecarisma/key-value-db
```

Using yarn:

```bash
yarn add @thecarisma/key-value-db
```

## Example

The following example load, update, read and remove a simple key value object 

```js
const KeyValueDB = require("@thecarisma/key-value-db");

//initialize the key-value 
var keyValueDB = new KeyValueDB.KeyValueDB("Greet=Hello World,Project=KeyValueDB", true, '=', ',', false);

//get an object
console.log(keyValueDB.get("Greet"));

//remove an object
keyValueDB.remove("Greet");

//add an object
keyValueDB.add("What", "i don't know what to write here");

//print all the objects
for (var kvo of keyValueDB) {
	console.log('$' + kvo);
};
```

## Legends

```
kvp  - Key Value Pair
kvdb - Key value Database
pss  - Possibly
kvo  - Key Value Object
```

## API

### Creating/loading a document

You can use the package to update and create an existing key value database. This library does not read the database from a file which means you have to find a way to read a string from the file. 

Create a new keyValueDB. The seperator between the key and value is `=` and the delimeter between the kvp is `\n`(newline).

```js
var keyValueDB = new KeyValueDB.KeyValueDB();
```

To load existing KeyValueDB  

```js
var keyValueDB = new KeyValueDB.KeyValueDB(
        "Greet=Hello World,Project=KeyValueDB", //pss read string from file
        true, //case sensitive is true
        '=', //the seperator from key and value
        ',', //the delimeter for the key-value-pair
        false //error tolerance if true no exception is thrown
        );
```

### Inserting Data

The only accepted type that can be inserted is a valid `KeyValueObject` and `String`. The method `add` can be used to add a new kvp into the object.

Add a kvp with it key and value

```js
keyValueDB.add("Greet", "Hello World");
```

Add a kvp using the `KeyValueObject` class.

```js
const keyValueObject = new KeyValueDB.KeyValueObject("Greet", "Hello World");
keyValueDB.add(keyValueObject);
```

### Finding Data

There are several way to find and get a value from the kvdb object. The value or the KeyValueObject can be gotten using the methods below

#### Get KeyValue Object

You can get the kvo using either the key or index. If the corresponding kvo is not found, an empty kvo is added to the db and then returned but not in the case when requested with the integer index. If a fallback kvo is sent as second parameter then when the request kvo is not found the fallback second parameter is added to the kvdb and then returned.

Get the kvo using it integer index

```js
keyValueDB.getKeyValueObject(0);
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

Get the kvo using it key 

```js
keyValueDB.getKeyValueObject("Greet");
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

Get the kvo using it key with fallback kvo

```js
const keyValueObject = new KeyValueDB.KeyValueObject("Name", "Azeez Adewale");
keyValueDB.getKeyValueObject("Name", keyValueObject);
//KeyValueObject {hashcode: 765363576, key: "Name", value: "Azeez Adewale"}
```

#### Get Like KeyValue Object

#### Get

#### Get Like

### Updating Data

#### Set

#### Set KeyValue Object

### Inserting Data

### Removing Data

## Contributing

Before you begin contribution please read the contribution guide at [CONTRIBUTING GUIDE](https://keyvaluedb.github.io/contributing.html)

You can open issue or file a request that only address problems in this implementation on this repo, if the issue address the concepts of the package then create an issue or rfc [here](https://github.com/keyvaluedb/key-value-db/)

**The world needs you**.

## License

MIT License Copyright (c) 2019 Azeez Adewale

