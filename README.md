# <p style="text-align: center;" align="center"><img src="https://github.com/konfiger/konfiger.github.io/raw/master/icons/konfiger-nodejs.png" alt="konfiger-nodejs" style="width:180px;height:160px;" width="180" height="160" /><br /> konfiger-nodejs</p>

<p style="text-align: center;" align="center">Light weight package to manage key value based configuration and data files.</p>

---

The notable use cases of this package is loading configuration file, language file, preference setting in an application. More use cases and examples can be seen [here](https://github.com/konfiger/konfiger.github.io/blob/master/usecases/use_cases.js.md).


___

## Table of content
- [Installation](#installation)
- [Examples](#examples)
    - [Basic](#basic)
    - [Write to disk](#write-to-disk)
    - [Get Types](#get-types)
    - [Lazy Loading](#lazy-loading)
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

### Lazy Loading

The lazyLoad parameter is useful for progressively read entries from a large file. The next example shows initializing from a file with so much key value entry with lazy loading:

The content of `test/konfiger.conf` is 

```
Ones=11111111111
Twos=2222222222222
Threes=3333333333333
Fours=444444444444
Fives=5555555555555
```

```js
const { Konfiger } = require("konfiger")

let konfiger = Konfiger.fromFile('test/konfiger.conf', //the file pth
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

The main Konfiger contructor is not exported from the package, the two functions are exported for initialization, `fromString` and `fromFile`. The fromString function creates a Konfiger object from a string with valid key value entry or from empty string, the fromFile function creates the Konfiger object from a file, the two functions accept a cumpulsory second parameter `lazyLoad` which indicates whether to read all the entry from the file or string suring initialization. The lazyLoad parameter is useful for progressively read entries from a large file. The two initializing functions also take 2 extra optional parameters `delimeter` and `seperator`. If the third and fourth parameter is not specified the default is used, delimeter = `=`, seperator = `\n`. If the file or string has different delimeter and seperator always send the third and fourth parameter.


```js
const { Konfiger } = require("konfiger")

//The following initializer progressively read the file when needed
let konfiger = Konfiger.fromFile('test/konfiger.conf', //the file pth
                                true //lazyLoad true
                                )

//The following initializer read all the entries from file at once
let konfiger = Konfiger.fromFile('test/konfiger.conf', false)

//The following initializer read all the entries from string when needed
let konfiger = Konfiger.fromString(`
Ones=11111111111
Twos=2222222222222
`, true)

//The following initializer read all the entries from String at once
let konfiger = Konfiger.fromString(`
Ones=11111111111
Twos=2222222222222
`, false)

//Initialize a string which have custom delimeter and seperator
let konfiger = Konfiger.fromString(`Ones:11111111111,Twos:2222222222222`, 
                                false, 
                                ':',
                                ',')
```

### Inserting

### Finding

### Updating

### Removing

### Saving to local disk

## API Documentations

Even though JavaScript is weakly type the package does type checking to ensure wrong datatype is not passed into the functions.

### KonfigerStream

| Function        | Description         
| --------------- | ------------- 
| fileStream(filePath, delimeter, seperator, errTolerance)  | Initialize a new KonfigerStream object from the filePath. It throws en exception if the filePath does not exist or if the delimeter or seperator is not a single character. The last parameter is boolean if true the stream is error tolerant and does not throw any exception on invalid entry, only the first parameter is cumpulsory.
| stringStream(rawString, delimeter, seperator, errTolerance)  | Initialize a new KonfigerStream object from a string. It throws en exception if the rawString is not a string or if the delimeter or seperator is not a single character. The last parameter is boolean if true the stream is error tolerant and does not throw any exception on invalid entry, only the first parameter is cumpulsory.
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
| enableCache(enableCache_)           | Enable or disable caching, caching speeds up data search but can take up space in memory (very small though). Using `getString` method to fetch vallue **99999999999** times with cache disabled takes over 1hr and with cache enabled takes 20min.
| errorTolerance(errTolerance)           | Enable or disable the error tolerancy property of the konfiger, if enabled no exception will be throw even when it suppose to there for it a bad idea but useful in a fail safe environment.
| isErrorTolerant() | Check if the konfiger object errTolerance is set to true.
| toString()           | All the kofiger datas are parsed into valid string with regards to the delimeter and seprator, the result of this method is what get written to file in the `save` method. The result is cached and calling the method while the no entry is added, deleted or updated just return the last result instead of parsing the entries again.

## How it works

Konfiger stream progressively load the key value entry from a file or string when needed, it uses two method `hasNext` which check if there is still an entry in the stream and `next` for the current key value entry in the stream. 
 
In Konfiger the key value pair is stored in a `map`, all search updating and removal is done on the `konfigerObjects` in the class. The string sent as first parameter if parsed into valid key value using the separator and delimiter fields and if loaded from file it content is parsed into valid key value pair. The `toString` method also parse the `keyValueObjects` content into a valid string with regards to the 
separator and delimeter. The value is properly escaped and unescaped.

The `save` function write the current `Konfiger` to the file, if the file does not exist it is created if it can. Everything is written in memory and is disposed on app exit hence it important to call the `save` function when nessasary.

## Contributing

Before you begin contribution please read the contribution guide at [CONTRIBUTING GUIDE](https://github.com/konfiger/konfiger.github.io/blob/master/CONTRIBUTING.MD)

You can open issue or file a request that only address problems in this implementation on this repo, if the issue address the concepts of the package then create an issue or rfc [here](https://github.com/konfiger/konfiger.github.io/)

## Support

You can support some of this community as they make big impact in the traing of individual to get started with software engineering and open source contribution.

- [https://www.patreon.com/devcareer](https://www.patreon.com/devcareer)

## License

MIT License Copyright (c) 2020 Adewale Azeez - konfiger

