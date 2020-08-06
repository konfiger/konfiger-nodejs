# <p style="text-align: center;" align="center"><img src="https://github.com/konfiger/konfiger.github.io/raw/master/icons/konfiger-nodejs.png" alt="konfiger-nodejs" style="width:180px;height:160px;" width="180" height="160" /><br /> konfiger-nodejs</p>

<p style="text-align: center;" align="center">Light weight package to manage key value based configuration and data files.</p>

---

The notable use cases of this package is loading configuration file, language file, preference setting in an application. 

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
    - [Read String with Stream](#read-string-with-stream)
    - [Skip Comment entries](#Skip-comment-entries)
    - [Resolve Object](#resolve-object)
    - [Dissolve Object](#dissolve-object)
    - [Multiline value](#multiline-value)
- [Native Object Attachement](#native-object-attachement)
    - [matchGetKey](#matchgetkey)
    - [matchPutKey](#matchputkey)
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
    - [Saving to disk](#saving-to-disk)
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

//to read all the entries simply call the toString() method
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

var kStream = KonfigerStream.fileStream('test/konfiger.conf')
while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}
```

### Read String with Stream

Read a key value string using the progressive [KonfigerStream](https://github.com/konfiger/konfiger-nodejs/blob/master/src/io/github/thecarisma/KonfigerStream.js), each scan returns the current key value array `[ 'key', 'value']`

```js
const { KonfigerStream } = require("konfiger")

var kStream = KonfigerStream.stringStream(`
String=This is a string
Number=215415245
Float=56556.436746
Boolean=true
`)

while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}
```

### Skip Comment entries

Read all the key value entry using the stream and skipping all commented entries. The default comment prefix is `//` but in the example below the commented entries starts with `#` so the prefix is changed. The same thing happen if the key value entry is loaded from file. 

```js
const { KonfigerStream } = require("konfiger")

var kStream = KonfigerStream.stringStream(`
String=This is a string
#Number=215415245
Float=56556.436746
#Boolean=true
`)
kStream.setCommentPrefix("#")

while (kStream.hasNext()) {
    let entry = kStream.next()
    console.log(entry)
}
```

### Resolve Object

The example below attach a javascript object to a konfiger object, whenever the value of the konfiger object changes the attached object entries is also updated.

For the file properties.conf

```
project = konfiger
author = Adewale Azeez
islibrary = true
```

```js
const { Konfiger } = require("konfiger")

var properties = {
    project: "",
    author: "",
    islibrary: false
}

var kon = Konfiger.fromFile('properties.conf')
kon.resolve(properties)

console.log(properties.project) // konfiger
console.log(properties.author) // Adewale Azeez
console.log(properties.islibrary) // true
kon.put("project", "konfiger-nodejs")
console.log(properties.project) // konfiger-nodejs
```

### Dissolve Object

The following snippet reads the value of a javascript object into the konfiger object, the object is not attached to konfiger unlike resolve function.

```js
const { Konfiger } = require("konfiger")

var properties = {
    project: "konfiger",
    author: "Adewale",
    islibrary: true
}

var kon = Konfiger.fromString('')
kon.dissolve(properties)

console.log(kon.get("project")) // konfiger
console.log(kon.get("author")) // Adewale Azeez
console.log(kon.getBoolean("islibrary")) // islibrary
```

### Multiline value

Konfiger stream allow multiline value. If the line ends with `\` the next line will be parse as the continuation and the leading spaces will be trimmed. The continuation character chan be changed like the example below the continuation character is changed from `\` to `+`.

for the file test.contd.conf

```
Description = This project is the closest thing to Android +
              Shared Preference in other languages +
              and off the Android platform.
ProjectName = konfiger
```

```js
const { KonfigerStream } = require("konfiger")

var ks = KonfigerStream.fileStream("test.contd.conf")
ks.setContinuationChar('+')
console.log(ks.next()[1])
console.log(ks.next()[1])
```

## Native Object Attachement

This feature of the project allow seamless integration with the konfiger entries by eliminating the need for writing `Konfiger.get*("")` everytime to read a value into a variable or writing lot of `Konfiger.put*()` to add an entry. 

The two function `resolve` is used to attach an object. resolve function integrate the object such that the entries in konfiger will be assigned to the matching key in the object. See the [resolve](#object-attachement-get) and [dissolve](#object-attachement-put) examples above.

In a case where the object keys are different from the entries keys in the konfiger object the function `matchGetKey` can be declared in the object to match the key when setting the object entries values, and the function `matchPutKey` is called when setting the konfiger entries from the object.

Konfiger is aware of the type of an object field, if the type of a field is boolean the entry value will be parsed as boolean and assigned to the field.

For the file English.lang

```
LoginTitle = Login Page
AgeInstruction = You must me 18 years or above to register
NewsletterOptin = Signup for our weekly news letter
ShouldUpdate = true
```

For an object which as the same key as the konfiger entries above there is no need to declare the matchGetKey or matchPutKey in the object. Resolve example

```js
const { Konfiger } = require("konfiger")

var pageProps = {
    LoginTitle: "",
    AgeInstruction: "",
    NewsletterOptin: "",
    ShouldUpdate: false
}

var kon = Konfiger.fromFile('English.lang')
kon.resolve(pageProps)
console.log(pageProps)
```

Dissolve example

```js
const { Konfiger } = require("konfiger")

var pageProps = {
    LoginTitle: "Login Page",
    AgeInstruction: "You must me 18 years or above to register",
    NewsletterOptin: "Signup for our weekly news letter",
    ShouldUpdate: true
}

var kon = Konfiger.fromString('')
kon.dissolve(pageProps)
console.log(kon.toString())
```

### matchGetKey

If the identifier in the object keys does not match the above entries key the object will not be resolved. For example loginTitle does not match LoginTitle, the matchGetKey can be used to map the variable key to the konfiger entry key. The following example map the object key to konfiger entries key.

```js
const { Konfiger } = require("konfiger")

var pageProps = {
    loginTitle: "",
    ageInstruct: "",
    NewsletterOptin: "",
    matchGetKey: function(key) {
        switch (key) {
            case "loginTitle":
                return "LoginTitle"
            case "ageInstruct":
                return "AgeInstruction"
        }
    }
}

var kon = Konfiger.fromFile('English.lang')
kon.resolve(pageProps)
console.log(pageProps)
```

The way the above code snippet works is that when iterating the object keys if check if the function matchGetKey is present in the object if it is present the key is sent as parameter to the matchGetKey and the returned value is used to get the value from konfiger, if the matchGetKey does not return anything the object key is used to get the value from konfiger (as in the case of NewsletterOptin).

> During the resolve or dissolve process if the entry value is function it is skipped even if it key matches

For dissolving an object the method matchGetKey is invoked to find the actual key to use to add the entry in konfiger, if the object does not declare the matchGetKey function the entries will be added to konfiger as it is declared. The following example similar to the one above but dissolves an object into konfiger.

```js
const { Konfiger } = require("konfiger")

var pageProps = {
    loginTitle: "Login Page",
    ageInstruct: "You must me 18 years or above to register",
    NewsletterOptin: "Signup for our weekly news letter",
    matchGetKey: function(key) {
        switch (key) {
            case "loginTitle":
                return "LoginTitle"
            case "ageInstruct":
                return "AgeInstruction"
        }
    }
}

var kon = Konfiger.fromString()
kon.dissolve(pageProps)
console.log(kon.toString())
```

### matchPutKey

The matchPutKey is invoked when an entry value is changed or when a new entry is added to konfiger. The matchPutKey is invoked with the new entry key and checked in the object matchPutKey (if decalred), the returned value is what is set in the object. E.g. if an entry `[Name, Thecarisma]` is added to konfiger the object matchPutKey is invoked with the parameter `Name` the returned value is used to set the corresponding object entry. 

```js
const { Konfiger } = require("konfiger")

var pageProps = {
    loginTitle: "",
    ageInstruct: "",
    NewsletterOptin: "",
    matchPutKey: function(key) {
        switch (key) {
            case "LoginTitle":
                return "loginTitle"
            case "AgeInstruction":
                return "ageInstruct"
        }
    }
}

var kon = Konfiger.fromString('')
kon.resolve(pageProps)

kon.put("LoginTitle", "Login Page")
kon.put("AgeInstruction", "You must me 18 years or above to register")
kon.put("NewsletterOptin", "Signup for our weekly news letter")
console.log(pageProps.loginTitle)
console.log(pageProps.ageInstruct)
console.log(pageProps.NewsletterOptin)
```

Konfiger does not create new entry in an object it just set existing values. Konfiger only change the value in an object if the key is defined

> Warning!!!
The values resolved is not typed so if the entry initial value is an integer the resolved value will be a string. All resolved value is string, you will need to do the type conversion by your self.

If your entry keys is the same as the object keys you don't need to declare the matchGetKey or matchPutKey function in the object.

## Usage

### Initialization

The main Konfiger contructor is not exported from the package, the two functions are exported for initialization, `fromString` and `fromFile`. The fromString function creates a Konfiger object from a string with valid key value entry or from empty string, the fromFile function creates the Konfiger object from a file, the two functions accept a cumpulsory second parameter `lazyLoad` which indicates whether to read all the entry from the file or string suring initialization. The lazyLoad parameter is useful for progressively read entries from a large file. The two initializing functions also take 2 extra optional parameters `delimeter` and `seperator`. If the third and fourth parameter is not specified the default is used, delimeter = `=`, seperator = `\n`. If the file or string has different delimeter and seperator always send the third and fourth parameter.

The following initializer progressively read the file when needed

```js
let konfiger = Konfiger.fromFile('test/konfiger.conf', true)
```

The following initializer read all the entries from file at once

```js
let konfiger = Konfiger.fromFile('test/konfiger.conf', false)
```

The following initializer read all the entries from string when needed

```js
let konfiger = Konfiger.fromString(`
Ones=11111111111
Twos=2222222222222
`, true)
```

The following initializer read all the entries from String at once

```js
let konfiger = Konfiger.fromString(`
Ones=11111111111
Twos=2222222222222
`, false)
```

Initialize a string which have custom delimeter and seperator

```js
let konfiger = Konfiger.fromString(`Ones:11111111111,Twos:2222222222222`, 
                                false, 
                                ':',
                                ',')
```

### Inserting

The following types can be added into the object, int, float, long, boolean, object and string.

To add any object into the entry use the `put` method as it check the value type and properly get it string value

```js
konfiger.put("String", "This is a string")
konfiger.put("Long", 143431423)
konfiger.put("Boolean", true)
konfiger.put("Float", 12.345)
```

The `put` method do a type check on the value and calls the appropriate put method e.g `konfiger.put("Boolean", true)` will result in a call to `konfiger.putBoolean("Boolean", true)`. The following method are avaliable to directly add the value according to the type, `putString`, `putBoolean`, `putLong` and `putInt`. The previous example can be re-written as:

```js
konfiger.putString("String", "This is a string")
konfiger.putLong("Long", 143431423)
konfiger.putBoolean("Boolean", true)
konfiger.putFloat("Float", 12.345)
```

### Finding

There are various ways to get the value from the konfiger object, the main `get` method and `getString` method both returns a string type, the other get methods returns specific types

```js
konfiger.get("String")
```

To get specific type from the object use the following methods, `getString`, `getBoolean`, `getLong`, `getFloat` and `getInt`. 

```js
konfiger.getString("String")
konfiger.getLong("Long")
konfiger.getBoolean("Boolean")
konfiger.getFloat("Float")
```

If the requested entrr does not exist a null/undefined value is returned, to prevent that a fallback value should be sent as second parameter incase the key is not found the second parameter will be returned.

```js
konfiger.get("String", "Default Value")
konfiger.getBoolean("Boolean", false)
```

If the konfiger is initialized with lazy loading enabled if the get method is called the stream will start reading until the key is found and the stream is paused again, if the key is not found the stream will read to end. 

### Updating

The `put` method can be used to add new entry or to update an already existing entry in the object. The `updateAt` method is usefull for updating a value using it index instead of key

```js
konfiger.updateAt(0, "This is an updated string")
```

### Removing

The `remove` method removes a key value entry from the konfiger, it returns true if an entry is removed and false if no entry is removed. The `remove` method accept either key(string) or index(int) of the entry.

```js
konfiger.remove("String")
konfiger.remove(0)
```

### Saving to disk

Every operation on the konfiger object is done in memory to save the updated entries in a file call the `save` method with the file path to save the entry. If the konfiger is initiated from file then there is no need to add the file path to the `save` method, the entries will be saved to the file path used during initialization.

```js
konfiger.save("test/test.config.ini")
```

in case of load from file, the save will write the entries to *test/test.config.ini*.

```js
//...
var konfiger = Konfiger.fromFile('test/test.config.ini', true)
//...
konfiger.save()
```

## API Documentations

Even though JavaScript is weakly type the package does type checking to ensure wrong datatype is not passed into the functions.

### KonfigerStream

| Function        | Description         
| --------------- | ------------- 
| KonfigerStream fileStream(filePath, delimeter, seperator, errTolerance)  | Initialize a new KonfigerStream object from the filePath. It throws en exception if the filePath does not exist or if the delimeter or seperator is not a single character. The last parameter is boolean if true the stream is error tolerant and does not throw any exception on invalid entry, only the first parameter is cumpulsory.
| KonfigerStream stringStream(rawString, delimeter, seperator, errTolerance)  | Initialize a new KonfigerStream object from a string. It throws en exception if the rawString is not a string or if the delimeter or seperator is not a single character. The last parameter is boolean if true the stream is error tolerant and does not throw any exception on invalid entry, only the first parameter is cumpulsory.
| Boolean hasNext()  | Check if the KonfigerStream still has a key value entry, returns true if there is still entry, returns false if there is no more entry in the KonfigerStream
| Array next()  | Get the next Key Value array from the KonfigerStream is it still has an entry. Throws an error if there is no more entry. Always use `hasNext()` to check if there is still an entry in the stream.
| Boolean isTrimingKey() | Check if the stream is configured to trim key, true by default
| void setTrimingKey(trimingKey) | Change the stream to enable/disable key trimming
| Boolean isTrimingValue() | Check if the stream is configured to trim entry value, true by default
| void setTrimingValue(trimingValue) | Change the stream to enable/disable entry value trimming
| getCommentPrefix() | Get the prefix string that indicate a pair entry if commented
| setCommentPrefix(commentPrefix) | Change the stream comment prefix, any entry starting with the comment prefix will be skipped. Comment in KonfigerStream is relative to the key value entry and not relative to a line.
| setContinuationChar(contdChar) | Set the character that indicates to the stream to continue reading for the entry value on the next line. The follwoing line leading spaces is trimmed. The default is `\`
| getContinuationChar() | Get the continuation character used in the stream.
| void validateFileExistence(filePath)  | Validate the existence of the specified file path if it does not exist an exception is thrown
| errorTolerance(errTolerance)           | Enable or disable the error tolerancy property of the konfiger, if enabled no exception will be throw even when it suppose to there for it a bad idea but useful in a fail safe environment.
| isErrorTolerant() | Check if the konfiger object errTolerance is set to true.

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
| void putDouble(key, value)           | Put a Double into the konfiger, the second parameter must be a Double
| void putComment(theComment)           | Put a literal comment into the konfiger, it simply add the comment prefix as key and value to the entries e.g. `kon.putComment("Hello World")` add the entry `//:Hello World`
| Array keys()           | Get all the keys entries in the konfiger object in iterable array list
| Array values()           | Get all the values entries in the konfiger object in iterable array list
| Array[Key, Value] entries()           | Get all the entries in the konfiger in a `[['Key', 'Value'], ...]`
| String get(key, defaultValue)       | Get a value as string, the second parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `undefined` will be returned
| String getString(key, defaultValue)   | Get a value as string, the second(string) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified empty string will be returned. 
| Boolean getBoolean(key, defaultValue)   | Get a value as boolean, the second(Boolean) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `false` will be returned. When trying to cast the value to boolean if an error occur an exception will be thrown except if error tolerance is set to true then false will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| Number getLong(key, defaultValue)   | Get a value as Number, the second(Number) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `0` will be returned. When trying to cast the value to Number if an error occur an exception will be thrown except if error tolerance is set to true then `0` will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| Number getInt(key, defaultValue)   | Get a value as Number, alias for `Number getLong(key, defaultValue)`.
| Float getFloat(key, defaultValue)   | Get a value as Float, the second(Float) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `0.0` will be returned. When trying to cast the value to Float if an error occur an exception will be thrown except if error tolerance is set to true then `0.0` will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| Double getDouble(key, defaultValue)   | Get a value as Double, the second(Double) parameter is optional if it is specified it is returned if the key does not exist, if the second parameter is not specified `0.0` will be returned. When trying to cast the value to Double if an error occur an exception will be thrown except if error tolerance is set to true then `0.0` will be returned. use `errorTolerance(Boolean)` to set the konfiger object error tolerancy.
| remove(keyIndex)           | Remove a key value entry at a particular index. Returns the value of the entry that was removed.
| remove(keyIndex)           | Remove a key value entry using the entry Key. Returns the value of the entry that was removed.
| appendString(rawString)          | Append new data to the konfiger from a string, the new string delimeter and seperator must be the same with the current konfigure delimeter and seperator, if it not the same use the `setDelimeter` and `setSeperator` to change the konfiger seperator and delimeter to the new file seperator and delimeter. If the Konfiger is initialized with lazy loading all the data will be loaded before the entries from the new string is added.
| appendFile(filePath)          | Read new datas from the file path and append, the new file delimeter and seperator must be the same with the current konfigure delimeter and seperator, if it not the same use the `setDelimeter` and `setSeperator` to change the konfiger seperator and delimeter to the new file seperator and delimeter. If the Konfiger is initialized with lazy loading all the data will be loaded before the entries from the new string is added.
| appendString(rawString, delimeter, separator)          | Append new data to the konfiger from a string. If the Konfiger is initialized with lazy loading all the data will be loaded before the entries from the new string is added.
| appendFile(filePath, delimeter, separator)          | Read new datas from the file path and append. If the Konfiger is initialized with lazy loading all the data will be loaded before the entries from the new string is added.
| save(filePath?)         | Save the konfiger datas into a file. The argument filePath is optional if specified the entries is writtent to the filePath else the filePath used to initialize the Konfiger object is used and if the Konfiger is initialized `fromString` and the filePath is not specified an exception is thrown. This does not clear the already added entries.
| getSeperator()           | Get seperator char that seperate the key value entry, default is `\n`.
| getDelimeter()           | Get delimeter char that seperated the key from it value, default is `=`.
| setSeperator(seperator)           | Change seperator char that seperate the datas, note that the file is not updates, to change the file call the `save()` function. If the new seperator is different from the old one all the entries values will be re parsed to get the new proper values, this process can take time if the entries is much.
| setDelimeter(delimeter)           | Change delimeter char that seperated the key from object, note that the file is not updates, to change the file call the `save()` function 
| size()           | Get the total size of key value entries in the konfiger
| clear()           | clear all the key value entries in the konfiger. This does not update the file call the `save` method to update the file
| isEmpty()           | Check if the konfiger does not have an key value entry.
| updateAt(index, value)           | Update the value at the specified index with the new string value, throws an error if the index is OutOfRange 
| contains(key)           | Check if the konfiger contains a key 
| enableCache(enableCache_)           | Enable or disable caching, caching speeds up data search but can take up space in memory (very small though). Using `getString` method to fetch vallue **99999999999** times with cache disabled takes over 1hr and with cache enabled takes 20min.
| toString()           | All the kofiger datas are parsed into valid string with regards to the delimeter and seprator, the result of this method is what get written to file in the `save` method. The result is cached and calling the method while the no entry is added, deleted or updated just return the last result instead of parsing the entries again.
| resolve(obj)           | Attach an object to konfiger, on attachment the values of the entries in the object will be set to the coresponding value in konfiger. The object can have the `matchGetKey` function which is called with a key in konfiger to get the value to map to the entry and the function `matchPutKey` to check which value to fetch from the object to put into konfiger.
| dissolve(obj) | Each string fields in the object will be put into konfiger. The object can have the `matchGetKey` function which is called with a key in konfiger to get the value to map to the entry. This does not attach the object.
| Object detach() | Detach the object attached to konfiger when the resolve function is called. The detached object is returned.

## How it works

Konfiger stream progressively load the key value entry from a file or string when needed, it uses two method `hasNext` which check if there is still an entry in the stream and `next` for the current key value entry in the stream. 
 
In Konfiger the key value pair is stored in a `map`, all search updating and removal is done on the `konfigerObjects` in the class. The string sent as first parameter if parsed into valid key value using the separator and delimiter fields and if loaded from file it content is parsed into valid key value pair. The `toString` method also parse the `konfigerObjects` content into a valid string with regards to the 
separator and delimeter. The value is properly escaped and unescaped.

The `save` function write the current `Konfiger` to the file, if the file does not exist it is created if it can. Everything is written in memory and is disposed on app exit hence it important to call the `save` function when nessasary.

## Contributing

Before you begin contribution please read the contribution guide at [CONTRIBUTING GUIDE](https://github.com/konfiger/konfiger.github.io/blob/master/CONTRIBUTING.MD)

You can open issue or file a request that only address problems in this implementation on this repo, if the issue address the concepts of the package then create an issue or rfc [here](https://github.com/konfiger/konfiger.github.io/)

## Support

You can support some of this community as they make big impact in the traing of individual to get started with software engineering and open source contribution.

- [https://www.patreon.com/devcareer](https://www.patreon.com/devcareer)

## License

MIT License Copyright (c) 2020 [Adewale Azeez](https://twitter.com/iamthecarisma) - konfiger

