
const assert = require('assert')
const KonfigerStream = require("../src/io/github/thecarisma/KonfigerStream.js")

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
    var ks = KonfigerStream.fileStream('test/test.txt', '=', '\n')
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
    var ks = KonfigerStream.stringStream(" Name =Adewale Azeez,Project =konfiger, Date=April 24 2020", '=', ',')
    assert.equal(ks.isTrimingKey(), false)
    ks.setTrimingKey(true)
    assert.equal(ks.isTrimingKey(), true)
    assert.equal(ks.next()[0], "Name")
    assert.equal(ks.next()[0], "Project")
    assert.equal(ks.next()[0], "Date")
})