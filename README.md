# <p style="text-align: center;" align="center"><img src="https://github.com/konfiger/konfiger.github.io/raw/master/icons/konfiger-nodejs.png" alt="konfiger-nodejs" style="width:180px;height:160px;" width="180" height="160" /><br /> konfiger-nodejs</p>

<p style="text-align: center;" align="center">Light weight package to manage key value based configuration and data files.</p>

---

The sample use cases of this package is loading configuration file, language file, preference setting in an application. More use cases can be seen [here](https://konfiger.github.io/usecases/index.html).


___

## Table of content
- [Installation](#installation)
- [Examples](#examples)
    - [Basic](#basic)
    - [Write to disk](#write-to-disk)
    - [Get Types](#get-types)
    - [Seperator and delimeter](#seperator-and-delimeter)
    - [Read file with Stream](#read-file-with-stream)
- [API Documentations](#api-documentations)
    - [KonfigerStream](#konfigerstream)
    - [Konfiger](#konfiger)
        - [Fields](#fields)
        - [Functions](#functions)
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

## Examples

### Basic

The following example load from file, add an entry, remove an entry and iterate all the key value entries

```js
const { Konfiger } = require("konfiger")

//initialize the key-value from file
var konfiger = Konfiger.fromFile('test/test.config.ini', true)

//add a string
konfiger.putString("Greet", "Hello World")

//get an object
console.log(konfiger.get("Greet"))

//remove an object
konfiger.remove("Greet")

//add an String
konfiger.putString("What", "i don't know what to write here");

for (var entry of konfiger.entries()) {
	console.log(entry)
}
```

### Write to disk

Initialize an empty konfiger object and populate it with random data, then save it to a file

```js
const { Konfiger } = require("konfiger")

let randomValues = [ 'One', 'Two', 'Three', 'Four', 'Five' ]
var konfiger = Konfiger.fromString("", false)

for (var i = 0; i < 200; ++i) {
    var random = Math.floor(Math.random() * (randomValues.length - 1) + 0)
    konfiger.putString(''+i, randomValues[random])
}
konfiger.save('test/konfiger.conf')
```

### Get Types

Load the entries as string and get them as a true type.

```js
const { Konfiger } = require("konfiger")

var konfiger = Konfiger.fromString(`
String=This is a string
Number=215415245
Float=56556.436746
Boolean=true
`, false)

var str = konfiger.getString("String")
var num = konfiger.getLong("Number")
var flo = konfiger.getFloat("Float")
var bool = konfiger.getBoolean("Boolean")

console.log(typeof str)
console.log(typeof num)
console.log(typeof flo)
console.log(typeof bool)
```

### Seperator and delimeter

Initailize a konfiger object with default seperator and delimeter then change the seperator and selimeter at runtime

```js
const { Konfiger } = require("konfiger")

let konfiger = Konfiger.fromFile('test/konfiger.conf', false)
konfiger.setDelimeter('?')
konfiger.setSeperator(',')

console.log(konfiger.toString())
```

### Read file with Stream

Read a key value file using the progressive [KonfigerStream](https://github.com/konfiger/konfiger-nodejs/blob/master/src/io/github/thecarisma/KonfigerStream.js), each scan returns the current key value array `[ 'key', 'value']`

```js
const { KonfigerStream } = require("konfiger")

var kStream = new KonfigerStream('test/konfiger.conf')
while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}
```

## Usage

### Initialization

### Inserting

### Finding

### Updating

### Removing

### Saving to local disk

## API Documentations

### KonfigerStream

| Function        | Description         
| --------------- | ------------- 
| KonfigerStream(filePath)  | initialize a new KonfigerStream object from the filePath. The default delimeter `=` and seperator `\n` is used. It throws en exception if the filePath does not exist
| KonfigerStream(filePath, delimeter, seperator)  | initialize a new KonfigerStream object from the filePath. It throws en exception if the filePath does not exist or if the delimeter or seperator is not a single character
| Boolean hasNext()  | Check if the KonfigerStream still has a key value entry, returns true if there is still entry, returns false if there is no more entry in the KonfigerStream
| Array next()  | Get the next Key Value array from the KonfigerStream is it still has an entry. Throws an error if there is no more entry. Always use `hasNext()` to check if there is still an entry in the stream
| void validateFileExistence(filePath)  | Validate the existence of the specified file path if it does not exist an exception is thrown

### Konfiger

#### Fields

| Field        | Description         
| --------------- | ------------- 
| MAX_CAPACITY  | The number of datas the konfiger can take, 10000000

#### Functions

| Function        | Description         
| --------------- | ------------- 
| Konfiger fromFile(filePath, lazyLoad)           | Create the konfiger object from a file, the first parameter(string) is the file path, the second parameter(boolean) indicates whether to read all the entry in the file in the constructor or when needed, the default delimeter(`=`) and seperator(`\n`) will be used. This creates the konfiger object from call to `fromStream(konfigerStream, lazyLoad)` with the konfigerStream initialized with the filePath parameter. The new Konfiger object is returned.
| Konfiger fromFile(filePath, lazyLoad, delimeter, seperator)           | Create the konfiger object from a file, the first(string) parameter is the file path, the second parameter(boolean) indicates whether to read all the entry in the file in the constructor or when needed, the third param(char) is the delimeter and the fourth param(char) is the seperator. This creates the konfiger object from call to `fromStream(konfigerStream, lazyLoad)` with the konfigerStream initialized with the filePath parameter. The new Konfiger object is returned.
| Konfiger fromString(rawString, lazyLoad)           | Create the konfiger object from a string, the first parameter is the String(can be empty), the second boolean parameter indicates whether to read all the entry in the file in the constructor or when needed, the default delimeter(`=`) and seperator(`\n`) will be used. The new Konfiger object is returned.
| Konfiger fromString(rawString, lazyLoad, delimeter, seperator)           | Create the konfiger object from a string, the first parameter is the String(can be empty), the second boolean parameter indicates whether to read all the entry in the file in the constructor or when needed, the third param is the delimeter and the fourth param is the seperator. The new Konfiger object is returned.
| Konfiger fromStream(KonfigerStream, Boolean)           | Create the konfiger object from a KonfigerStream object, the second boolean parameter indicates whether to read all the entry in the file in the constructor or when needed this make data loading progressive as data is only loaded from the file when put or get until the Stream reaches EOF. The new Konfiger object is returned.
| void put(key, value)           | Put any object into the konfiger. if the second parameter is a Javascript Object, `JSON.stringify` will be used to get the string value of the object else the appropriate put* method will be called. e.g `put('Name', 'Adewale')` will result in the call `putString('Name', 'Adewale')`.
| void putString(key, value)           | Put a String into the konfiger, the second parameter must be a string.
| void putBoolean(key, value)           | Put a Boolean into the konfiger, the second parameter must be a Boolean.
| void putLong(key, value)           | Put a Long into the konfiger, the second parameter must be a Number.
| void putInt(key, value)           | Put a Int into the konfiger, alias for `void putLong(key, value)`.
| void putFloat(key, value)           | Put a Float into the konfiger, the second parameter must be a Float
| Array keys()           | Get all the keys entries in the konfiger object in iterable array list
| Array values()           | Get all the values entries in the konfiger object in iterable array list
| Array[Key, Value] entries()           | Get all the entries in the konfiger in a `[['Key', 'Value'], ...]`
| String get(key, defaultValue)       | Get a value as string, the second parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `undefined` will be returned
| String getString(key, defaultValue)   | Get a value as string, the second(string) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified empty string will be returned. 
| Boolean getBoolean(key, defaultValue)   | Get a value as boolean, the second(Boolean) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `false` will be returned. When trying to cast the value to boolean if an error occur an exception will be thrown except if error tolerance is set to true then false will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| Number getLong(key, defaultValue)   | Get a value as Number, the second(Number) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `0` will be returned. When trying to cast the value to Number if an error occur an exception will be thrown except if error tolerance is set to true then `0` will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| Number getInt(key, defaultValue)   | Get a value as Number, alias for `Number getLong(key, defaultValue)`.
| Float getFloat(key, defaultValue)   | Get a value as Float, the second(Float) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `0.0` will be returned. When trying to cast the value to Float if an error occur an exception will be thrown except if error tolerance is set to true then `0.0` will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| remove(keyIndex)           | Remove a key value entry at a particular index
| remove(keyIndex)           | Remove a key value entry using the entry Key 
| appendString(rawString)          | Append new data to the konfiger from a string, the new string delimeter and seperator must be the same with the current konfigure delimeter and seperator, if it not the same use the `setDelimeter` and `setSeperator` to change the konfiger seperator and delimeter to the new file seperator and delimeter. If the Konfiger is initialized with lazy loading all the data will be loaded before the entries from the new string is added.
| appendFile(filePath)          | Read new datas from the file path and append, the new file delimeter and seperator must be the same with the current konfigure delimeter and seperator, if it not the same use the `setDelimeter` and `setSeperator` to change the konfiger seperator and delimeter to the new file seperator and delimeter. If the Konfiger is initialized with lazy loading all the data will be loaded before the entries from the new string is added.
| save(filePath?)         | Save the konfiger datas into a file. The argument filePath is optional if specified the entries is writtent to the filePath else the filePath used to initialize the Konfiger object is used and if the Konfiger is initialized `fromString` and the filePath is not specified an exception is thrown. This does not clear the already added entries.
| getSeperator()           | Get seperator char that seperate the key value entry, default is `\n`.
| getDelimeter()           | Get delimeter char that seperated the key from it value, default is `=`.
| setSeperator(seperator)           | Change seperator char that seperate the datas, note that the file is not updates, to change the file call the `save()` function
| setDelimeter(delimeter)           | Change delimeter char that seperated the key from object, note that the file is not updates, to change the file call the `save()` function 
| size()           | Get the total size of key value entries in the konfiger
| clear()           | clear all the key value entries in the konfiger. This does not update the file call the `save` method to update the file
| isEmpty()           | Check if the konfiger does not have an key value entry.
| updateAt(index, value)           | Update the value at the specified index with the new string value, throws an error if the index is OutOfRange 
| contains(key)           | Check if the konfiger contains a key 
| enableCache(enableCache_)           | Enable or disable caching, caching speeds up data search but can take up space in memory (very small though). Using `getString` method **99999999999** with cache disabled takes over 1hr and with cache enabled takes 20min.
| errorTolerance(errTolerance)           | Enable or disable the error tolerancy property of the konfiger, if enabled no exception will be throw even when it suppose to there for it a bad idea but useful in a fail safe environment.
| toString()           | All the kofiger datas are parsed into valid string with regards to the delimeter and seprator, the result of this method is what get written to file in the `save` method. The result is cached and calling the method while the no entry is added, deleted or updated just return the last result instead of parsing the entries again.

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

