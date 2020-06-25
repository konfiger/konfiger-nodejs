
const assert = require('assert')
const { KonfigerStream } = require("../index.js")

it('should throw exceptions', () => {
    assert.throws(function () { 
        var ks = KonfigerStream.fileStream()
    }, Error, "Error: io.github.thecarisma.KonfigerStream: The file path cannot be null")
    
    assert.throws(function () { 
        var ks = KonfigerStream.fileStream(20)
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid argument expecting string found number")
    
    assert.throws(function () { 
        var ks = KonfigerStream.fileStream("./tryer.ini")
    }, Error, "Error: io.github.thecarisma.KonfigerStream: The file does not exists ./tryer.ini")
    
    assert.throws(function () { 
        var ks = KonfigerStream.fileStream("./index.js", ',')
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid length of argument, seperator or delimeter parameter is missing")
    
    assert.throws(function () { 
        var ks = KonfigerStream.fileStream("./index.js", ',', '==')
    }, Error, "Error: io.github.thecarisma.KonfigerStream: invalid argument for seperator expecting char found string")
    
    assert.throws(function () { 
        var ks = KonfigerStream.stringStream(30)
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid first argument expecting string found number")
})

it('should successfully initialize', () => {
    assert.notEqual(KonfigerStream.fileStream("./index.js"), null)
})

it('validate the file stream value', () => {
    var ks = KonfigerStream.fileStream('test/test.config.ini', '=', '\n')
    while (ks.hasNext()) {
        assert.notEqual(ks.next(), null)
    }
})

it('validate the string stream key', () => {
    var ks = KonfigerStream.stringStream(" Name =Adewale Azeez,Project =konfiger, Date=April 24 2020", '=', ',')
    assert.equal(ks.next()[0], "Name")
    assert.equal(ks.next()[0], "Project")
    assert.equal(ks.next()[0], "Date")
})

it('validate the string stream value', () => {
    var ks = KonfigerStream.stringStream("Name=Adewale Azeez,Project=konfiger, Date=April 24 2020", '=', ',')
    assert.equal(ks.next()[1], "Adewale Azeez")
    assert.equal(ks.next()[1], "konfiger")
    assert.equal(ks.next()[1], "April 24 2020")
})

it('test string stream key trimming', () => {
    var ks = KonfigerStream.stringStream(" Name =Adewale Azeez:Project =konfiger: Date=April 24 2020", '=', ':')
    assert.equal(ks.isTrimmingKey(), true)
    ks.setTrimmingKey(false)
    assert.throws(function () { 
        ks.setTrimmingKey("Hello World")
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid argument, expecting a boolean found string")
    assert.equal(ks.isTrimmingKey(), false)
    assert.equal(ks.next()[0], " Name ")
    assert.equal(ks.next()[0], "Project ")
    assert.equal(ks.next()[0], " Date")
})

it('test the single pair commenting in string stream', () => {
    var ks = KonfigerStream.stringStream("Name:Adewale Azeez,//Project:konfiger,Date:April 24 2020", ':', ',')
    while (ks.hasNext()) {
        assert.notEqual(ks.next()[0], "Project")
    }
    assert.throws(function () { 
        assert.notEqual(ks.next()[0], "Project")
    }, Error, "Error: io.github.thecarisma.KonfigerStream: You cannot read beyound the stream length, always use hasNext() to verify the Stream still has an entry")
})

it('test the single pair commenting in file stream 1', () => {
    var ks = KonfigerStream.fileStream("test/test.comment.inf")
    ks.setCommentPrefix("[")
    while (ks.hasNext()) {
        assert.equal(ks.next()[0].startsWith("["), false)
    }
})

it('test the single pair commenting in file stream', () => {
    var ks = KonfigerStream.fileStream("test/test.txt", ':',  ',')
    while (ks.hasNext()) {
        assert.equal(ks.next()[0].startsWith("//"), false)
    }
})

it('test string stream value trimming', () => {
    var ks = KonfigerStream.stringStream(" Name =Adewale Azeez :Project = konfiger: Date= April 24 2020 :Language = Multiple Languages", '=', ':')
    assert.notEqual(ks.isTrimmingValue(), false)
    assert.throws(function () { 
        ks.setTrimmingValue("Hello World")
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid argument, expecting a boolean found string")
    assert.equal(ks.isTrimmingValue(), true)
    assert.equal(ks.next()[1], "Adewale Azeez")
    assert.equal(ks.next()[1], "konfiger")
    assert.equal(ks.next()[1], "April 24 2020")
    assert.equal(ks.next()[1], "Multiple Languages")
})

it('test string stream key value trimming', () => {
    var entriesStr = " Name =Adewale Azeez :Project = konfiger: Date= April 24 2020 :Language = Multiple Languages"
    var ks = KonfigerStream.stringStream(entriesStr, '=', ':')
    var ks1 = KonfigerStream.stringStream(entriesStr, '=', ':')
    assert.equal(ks.next()[0], "Name")
    assert.equal(ks.next()[0], "Project")
    assert.equal(ks.next()[0], "Date")
    assert.equal(ks.next()[0], "Language")
    
    
    assert.equal(ks1.next()[1], "Adewale Azeez")
    assert.equal(ks1.next()[1], "konfiger")
    assert.equal(ks1.next()[1], "April 24 2020")
    assert.equal(ks1.next()[1], "Multiple Languages")
})

it('read multiline entry and test continuation char in file stream', () => {
    var ks = KonfigerStream.fileStream("test/test.contd.conf")
    while (ks.hasNext()) {
        assert.equal(ks.next()[1].indexOf('\n'), -1)
    }
})

it('read multiline entry and test continuation char in string stream', () => {
    var ks = KonfigerStream.stringStream(`
Description = This project is the closest thing to Android +
              [Shared Preference](https://developer.android.com/reference/android/content/SharedPreferences) +
              in other languages and off the Android platform.
ProjectName = konfiger
ProgrammingLanguages = C, C++, C#, Dart, Elixr, Erlang, Go, +
                        Haskell, Java, Kotlin, NodeJS, Powershell, +
                        Python, Ring, Rust, Scala, Visual Basic, +
                        and whatever language possible in the future
`)
    ks.setContinuationChar('+')
    while (ks.hasNext()) {
        assert.equal(ks.next()[1].indexOf('\n'), -1)
    }
})

it('test backward slash ending value', () => {
    var ks = KonfigerStream.stringStream("uri1 = http://uri1.thecarisma.com/core/api/v1/\r\n" +
                "uri2 = http://uri2.thecarisma.com/core/api/v2/\r\n" +
                "ussd.uri = https://ussd.thecarisma.com/")

	var count = 0
	while(ks.hasNext()) {
		assert.equal(ks.next()[1].endsWith("/"), true)
		count++
	}
	assert.equal(count, 3)
})

it('test escape slash ending', () => {
    var ks = KonfigerStream.stringStream("external-resource-location = \\\\988.43.13.9\\testing\\public\\sansportal\\rideon\\\\\r\n" +
                "boarding-link = https://boarding.thecarisma.com/konfiger\r\n" +
                "ussd.uri = thecarisma.com\\")

	var count = 0
	while(ks.hasNext()) {
		assert.notEqual(ks.next()[1].length, 0)
		count++
	}
	assert.equal(count, 3)
})









