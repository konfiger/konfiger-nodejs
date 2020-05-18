
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
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid length of argument, seperator parameter is missing")
    
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
    var ks = KonfigerStream.stringStream("Name=Adewale Azeez,Project=konfiger, Date=April 24 2020", '=', ',')
    assert.equal(ks.next()[0], "Name")
    assert.equal(ks.next()[0], "Project")
    assert.equal(ks.next()[0], " Date")
})

it('validate the string stream value', () => {
    var ks = KonfigerStream.stringStream("Name=Adewale Azeez,Project=konfiger, Date=April 24 2020", '=', ',')
    assert.equal(ks.next()[1], "Adewale Azeez")
    assert.equal(ks.next()[1], "konfiger")
    assert.equal(ks.next()[1], "April 24 2020")
})

it('test string stream key trimming', () => {
    var ks = KonfigerStream.stringStream(" Name =Adewale Azeez:Project =konfiger: Date=April 24 2020", '=', ':')
    assert.equal(ks.isTrimingKey(), false)
    ks.setTrimingKey(true)
    assert.throws(function () { 
        ks.setTrimingKey("Hello World")
    }, Error, "Error: io.github.thecarisma.KonfigerStream: Invalid argument, expecting a boolean found string")
    assert.equal(ks.isTrimingKey(), true)
    assert.equal(ks.next()[0], "Name")
    assert.equal(ks.next()[0], "Project")
    assert.equal(ks.next()[0], "Date")
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









