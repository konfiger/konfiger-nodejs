# <p style="text-align: center;" align="center"><img src="https://github.com/konfiger/konfiger.github.io/raw/master/icons/konfiger-nodejs.png" alt="konfiger-nodejs" style="width:180px;height:160px;" width="180" height="160" /><br /> konfiger-nodejs</p>

<p style="text-align: center;" align="center">Light weight package to manage key value based configuration and data files.</p>

---

The sample use cases of this package is loading configuration file, language file, preference setting in an application. More use cases can be seen [here](https://konfiger.github.io/usecases/index.html).


___

## Table of content
- [Installation](#installation)
- [Example](#example)
    - [Basic](#basic)
    - [Write to disk](#write-to-disk)
- [API Documentations](#api-documentation)
- [Usage](#usage)
	- [Initialization](#initialization)
	- [Inserting](#inserting)
	- [Finding](#finding)
	- [Updating](#updating)
	- [Removing](#removing)
    - [Saving to local disk](#saving-to-local-disk)
- [How it works](#how-it-works)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Installation

Module name on npm and bower is konfiger.

Using npm:

```bash
npm install konfiger
```

Using bower:

```bash
bower install konfiger
```

Using yarn:

```bash
yarn add konfiger
```

## Example

### Basic

The following example load from file, add an entry, remove an entry and iterate all the key value entries

```js
const { Konfiger } = require("konfiger")

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
```

### Write to disk

## Usage

### Initialization

### Inserting

### Finding

### Updating

### Removing

### Saving to local disk

## API Documentations

## How it works

## Contributing

Before you begin contribution please read the contribution guide at [CONTRIBUTING GUIDE](https://github.com/konfiger/konfiger.github.io/blob/master/CONTRIBUTING.MD)

You can open issue or file a request that only address problems in this implementation on this repo, if the issue address the concepts of the package then create an issue or rfc [here](https://github.com/konfiger/konfiger.github.io/)

## Support

You can support some of this community as they make big impact in the developement of people to get started with software engineering.

- https://www.patreon.com/devcareer

## License

MIT License Copyright (c) 2020 Adewale Azeez - konfiger


---

## API

Even though JavaScript is weakly type the package does type checking to ensure wrong datatype is not passed into the method.

### Creating/loading a document

You can use the package to update and create an existing key value database. This library does not read the database from a file which means you have to find a way to read a string from the file. 

Create a new konfiger. The default seperator between the key and value is `=` and the delimeter between the kvp is `\n`(newline).

```js
var konfiger = new konfiger.konfiger();
```

To load existing konfiger  

```js
var konfiger = new konfiger.konfiger(
        "Greet=Hello World,Project=konfiger", //pss read string from file
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
konfiger.add("Greet", "Hello World");
```

Add a kvp using the `KeyValueObject` class.

```js
const keyValueObject = new konfiger.KeyValueObject("Greet", "Hello World");
konfiger.add(keyValueObject);
```

### Finding Data

There are several way to find and get a value from the kvdb object. The value or the KeyValueObject can be gotten using the methods below

#### Get KeyValue Object

You can get the kvo using either the key or index. If the corresponding kvo is not found, an empty kvo is added to the db and then returned but not in the case when requested with the integer index. If a fallback kvo is sent as second parameter then when the request kvo is not found the fallback second parameter is added to the kvdb and then returned.

Get the kvo using it integer index

```js
konfiger.getKeyValueObject(0);
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

Get the kvo using it key 

```js
konfiger.getKeyValueObject("Greet");
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

Get the kvo using it key with fallback kvo

```js
const keyValueObject = new konfiger.KeyValueObject("Name", "Adewale Azeez");
konfiger.getKeyValueObject("Name", keyValueObject);
//KeyValueObject {hashcode: 765363576, key: "Name", value: "Adewale Azeez"}
```

#### Get Like KeyValue Object

Get a kvo by checking the kvdb for the kvo object that contains a part of the key. If a fallback kvo is sent as second parameter then when the request kvo is not found the fallback second parameter is added to the kvdb and then returned.

Get a similar kvo using it key part 

```js
konfiger.getLikeKeyValueObject("eet");
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

Get a similar kvo using it key part with fallback kvo

```js
const keyValueObject = new konfiger.KeyValueObject("Name", "Adewale Azeez");
konfiger.getKeyValueObject("Nam", keyValueObject);
//KeyValueObject {hashcode: 765363576, key: "Name", value: "Adewale Azeez"}
```

#### Get

You can get a kvdb value using either the key or index. If the corresponding value is not found, an empty string is added to the db and then returned but not in the case when requested with the integer index. 

If a fallback kvo is sent as second parameter then when the request key is not found the fallback second parameter is added to the kvdb and then value is returned. If a string value is sent as the second value it is returned if the key is not found in the kvdb.

Get a value using it integer index

```js
konfiger.get(0);
//"Hello World"
```

Get the value using it key 

```js
konfiger.get("Greet");
//"Hello World"
```

Get the kvo using it key with fallback value

```js
konfiger.get("Licence", "The MIT Licence");
//"The MIT Licence"
```

Get the kvo using it key with fallback kvo

```js
const keyValueObject = new konfiger.KeyValueObject("Licence", "The MIT Licence");
konfiger.get("Name", keyValueObject);
//"The MIT Licence"
```

#### Get Like 

Get a value by checking the kvdb for the kvo object that contains a part of the key. 

If a fallback kvo is sent as second parameter then when the request key is not found the fallback second parameter is added to the kvdb and then value is returned.

Get a value using it key part 

```js
konfiger.getLike("eet");
//"Hello World"
```

Get a value using it key part with fallback kvo

```js
const keyValueObject = new konfiger.KeyValueObject("Licence", "The MIT Licence");
konfiger.getLike("Li", keyValueObject);
//"The MIT Licence"
```

### Updating Data

There are various way to update a kvp in the kvdb, the value can be changed directly or set to a new KeyValueObject. If you try to set a kvo that does not exist in the kvdb using it key, it is added to the kvdb.

#### Set

The `set` method is used to change the value of the kvo using the index of the kvo or a kvo key. 

Set a kvo value using it index

```js
konfiger.set(0, "Hello World from thecarisma");
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World from thecarisma"}
```

Set a kvo value using it key

```js
konfiger.set("Greet", "Hello World from thecarisma");
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World from thecarisma"}
```

#### Set KeyValue Object

Completly change a KeyValueObject in the kvdb using either it index or it key. The kvo is completly replaced which means unique fields like the hashcode of the kvo changes. When the kvo is set using it key if the corresponding kvo does not exist it is added into the kvdb.
Note that this method completly changes the kvo so it can be used to replace a kvo.

Set a kvo using it index

```js
const keyValueObject = new konfiger.KeyValueObject("Licence", "The MIT Licence");
konfiger.setKeyValueObject(0, keyValueObject);
//KeyValueObject {hashcode: 566565, key: "Licence", value: "The MIT Licence"}
```

Set a kvo value using it key

```js
const keyValueObject = new konfiger.KeyValueObject("Licence", "The MIT Licence");
konfiger.setKeyValueObject("Greet", keyValueObject);
//KeyValueObject {hashcode: 566565, key: "Licence", value: "The MIT Licence"}
```

### Inserting Data

A new kvp can be inserted by invoking the `add` method. The kvp can be added using it key and value or by directly adding the KeyValueObject to the kvdb. 

Add a new kvp using the key and value

```js
konfiger.add("Key", "This is the value");
```

Add a new kvp using a new KeyValueObject

```js
const keyValueObject = new konfiger.KeyValueObject("Key", "This is the value");
konfiger.add(keyValueObject);
```

### Removing Data

Remove a kvp completely from the kvdb using either it key of the integer index. The kvp that was removed is returned from the method. If the index does not exist out of bound error occur and if a kvo with the key is not present nothing is done but an empty kvo is returned.

Remove a kvp using integer index

```js
konfiger.remove(0);
//removes the first kvp in the kvdb
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

Remove a kvp using it key

```js
konfiger.remove("Greet");
//removes the first kvp in the kvdb
//KeyValueObject {hashcode: 69066473, key: "Greet", value: "Hello World"}
```

## Size, Clear, isEmpty

### Size

Get the size of the kvo in the kvdb.

```js
konfiger.size();
//4
```

### Clear

Remove all the elements and kvo from the kvdb

```js
konfiger.clear();
//konfiger.size() = 0
```

### isEmpty

Check whether the kvdb contains any kvo in it.

```js
konfiger.isEmpty();
//false
```

## Saving collection

The kvp collection kvdb can be inspected as a string using the `toString` method. The returned value can be saved locally by writing to a persistent storage or to a plain text file. The output of the `toString` method is determined by the kvos, the seperator and the delimeter.

```js
konfiger.toString();
// "Greet=Hello World,Project=konfiger,Project=konfiger,Licence=The MIT Licence"
```

## Iterating collection

The konfiger object can be iterated natively using the `for..of` loop expression. 

```js
for (var kvo of konfiger) {
    //operate on the KeyValueObject
};
```

## How it works

KeyValueObject class contains the key and value field and the fields setter and getter. 
The KeyValueObject is the main internal type used in the konfiger class.
 
In konfiger the key value pair is stored in `Array[]` type, all search, 
updating and removal is done on the `keyValueObjects` in the class. The string sent as 
first parameter if parsed into valid key value using the separator and delimiter fields. The 
`toString` method also parse the `keyValueObjects` content into a valid string with regards to the 
separator and delimeter. 

## Contributing

Before you begin contribution please read the contribution guide at [CONTRIBUTING GUIDE](https://konfiger.github.io/contributing.html)

You can open issue or file a request that only address problems in this implementation on this repo, if the issue address the concepts of the package then create an issue or rfc [here](https://github.com/konfiger/konfiger.github.io/)

## Support

You can support some of this community as they make big impact in the developement of people to get started with software engineering.

- https://www.patreon.com/devcareer

## License

MIT License Copyright (c) 2020 Adewale Azeez - konfiger

