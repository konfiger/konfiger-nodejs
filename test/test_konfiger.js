
const assert = require('assert')
const { Konfiger, KonfigerStream } = require("../index.js")

it('validate konfiger string stream entries', () => {
    var konfiger = Konfiger.fromString(`
String=This is a string
Number=215415245
Float=56556.436746
Boolean=true
`, false)

    assert.equal(konfiger.get("String"), "This is a string")
    assert.equal(konfiger.get("Number"), "215415245")
    assert.equal(konfiger.get("Float"), "56556.436746")
    assert.notEqual(konfiger.get("Number"), "true")
    assert.equal(konfiger.get("Boolean"), "true")
    konfiger.put("String", "This is an updated string")
    assert.equal(konfiger.get("String"), "This is an updated string")
})

it('validate konfiger entries get() method', () => {
    var konfiger = Konfiger.fromFile('test/test.config.ini')
    konfiger.put("One", konfiger)
    konfiger.put("Two", '"hello", "world"')
    konfiger.put("Three", 3)
    konfiger.putInt("Four", 4)
    konfiger.putBoolean("Five", true)
    konfiger.put("Six", false)
    konfiger.put("Seven", "121251656.1367367263726")
    konfiger.putFloat("Eight", 0.21)
    
    assert.notEqual(konfiger.get("One"), konfiger.toString())  
    assert.equal(konfiger.get("Two"), '"hello", "world"') 
    assert.equal(konfiger.get("Three"), 3) 
    assert.equal(konfiger.get("Four"), 4) 
    assert.equal(konfiger.get("Five"), "true") 
    assert.equal(konfiger.get("Six"), "false") 
    assert.equal(konfiger.get("Seven"), "121251656.1367367263726") 
    assert.equal(konfiger.get("Eight"), "0.21") 
})

it('validate lazyload konfiger entries get() with fallback', () => {
    var konfiger = Konfiger.fromFile('test/test.config.ini', true)
    
    assert.equal(konfiger.get("Occupation", "Pen Tester"), "Software Engineer") 
    assert.equal(konfiger.get("Hobby", "Worm Creation"), "i don't know")
    assert.equal(konfiger.get("Fav OS"), null)
    assert.notEqual(konfiger.get("Fav OS", "Whatever get work done"), null)
})

it('validate konfiger get*() returned types', () => {
    var konfiger = Konfiger.fromString('')
    konfiger.put("One", konfiger)
    konfiger.putLong("Two", 123456789)
    konfiger.putBoolean("Bool", true)
    konfiger.putFloat("Float", 123.56)
    konfiger.putString("Dummy", "Noooooo 1")
    konfiger.putString("Dummy2", "Noooooo 2")
    
    assert.equal(konfiger.get("Two"), "123456789")
    assert.equal(konfiger.getLong("Two"), 123456789)
    assert.notStrictEqual(konfiger.getLong("Two"), "123456789")
    
    assert.equal(konfiger.get("Bool"), "true")
    assert.equal(konfiger.getBoolean("Two"), false)
    assert.notEqual(konfiger.getBoolean("Two"), true)
    assert.notEqual(konfiger.getBoolean("Two"), "true")
    
    assert.equal(konfiger.get("Float"), "123.56")
    assert.equal(konfiger.getFloat("Float"), 123.56)
    assert.notStrictEqual(konfiger.getFloat("Float"), "123.56") 
})

it('validate konfiger default value for non existing key', () => {
    var konfiger = Konfiger.fromString('')
    
    assert.equal(konfiger.get("Name"), null)
    assert.notEqual(konfiger.getString("Name"), null)
    assert.equal(konfiger.getString("Name"), "")
    assert.notEqual(konfiger.get("Name", "Adewale Azeez"), null)
    assert.equal(konfiger.get("Name", "Adewale Azeez"), "Adewale Azeez")
    assert.equal(konfiger.getBoolean("CleanupOnClose"), false)
    assert.notEqual(konfiger.getBoolean("CleanupOnClose", true), false)
    assert.equal(konfiger.getLong("TheNumber"), 0)
    assert.equal(konfiger.getLong("TheNumber", 123), 123)
    assert.equal(konfiger.getFloat("TheNumber"), 0.0)
    assert.notEqual(konfiger.getFloat("TheNumber"), 0.1)
})

it('remove entry and validate size', () => {
    var konfiger = Konfiger.fromString('One=111,Two=222,Three=333', false, '=', ',')
    konfiger.stream.errorTolerance(true)
    
    assert.equal(konfiger.size(), 3)
    assert.notEqual(konfiger.get("Two"), null)
    assert.equal(konfiger.remove("Two"), "222")
    assert.equal(konfiger.get("Two"), null)
    assert.equal(konfiger.size(), 2)
    assert.equal(konfiger.remove(0), "111")
    assert.equal(konfiger.size(), 1)
    assert.equal(konfiger.get("Three"), "333")
})

it('set get delimeter and seperator', () => {
    var konfiger = Konfiger.fromFile('test/test.config.ini', true)
    
    assert.equal(konfiger.getSeperator(), "\n")
    assert.equal(konfiger.getDelimeter(), "=")
    assert.equal(konfiger.toString().split("\n").length > 2, true)
    konfiger.setSeperator('-')
    konfiger.setDelimeter('+')
    assert.equal(konfiger.getSeperator(), "-")
    assert.equal(konfiger.getDelimeter(), "+")
    assert.equal(konfiger.toString().split("\n").length, 1)
})

it('escaping and unescaping entries and save', () => {
    var ks = KonfigerStream.fileStream('test/test.config.ini')
    var ks1 = KonfigerStream.fileStream('test/test.txt', ':',  ',')
    var konfiger = Konfiger.fromStream(ks, true)
    var konfiger1 = Konfiger.fromStream(ks1, true)
    
    assert.equal(konfiger.get("Hobby"), "i don't know")
    assert.equal(konfiger1.get("Hobby"), konfiger.get("Hobby"))
    assert.equal(konfiger1.get("Hobby"), "i don't know")
    konfiger.save('test/test.config.ini')
    
    var newKs = KonfigerStream.fileStream('test/test.config.ini')
    var newKonfiger = Konfiger.fromStream(newKs, true)
    var newKonfiger1 = Konfiger.fromFile('test/test.txt', true, ':',  ',')
    assert.equal(konfiger.toString(), newKonfiger.toString())
    assert.equal(konfiger1.toString(), newKonfiger1.toString())
})

it('test complex and confusing seperator', () => {
    var konfiger = Konfiger.fromString(`Occupation=Software En^gineergLocation=Ni^geriagState=La^gos`, false, '=', 'g')
    
    assert.equal(konfiger.size(), 3)
    assert.equal(konfiger.toString().indexOf("^g") > -1, true)
    for (var entry of konfiger.entries()) {
        assert.equal(entry[1].indexOf("^g") > -1, false)
    }
    konfiger.setSeperator('f')
    assert.equal(konfiger.get("Occupation"), "Software Engineer")
    konfiger.setSeperator('\n')
    assert.equal(konfiger.toString().indexOf("^g") > -1, false)
    assert.equal(konfiger.size(), 3)
    for (var entry of konfiger.entries()) {
        assert.equal(entry[1].indexOf("\\g") > -1, false)
    }
})

it('append new unparsed entries from string and file', () => {
    var konfiger = Konfiger.fromString('')
    
    assert.equal(konfiger.size(), 0)    
    konfiger.appendString('Language=English')
    assert.equal(konfiger.size(), 1)
    assert.equal(konfiger.get("Name"), null)
    assert.notEqual(konfiger.get("Name"), "Adewale Azeez")
    assert.equal(konfiger.get("Language"), "English")
    
    konfiger.appendFile('test/test.config.ini')
    assert.notEqual(konfiger.get("Name"), null)
    assert.equal(konfiger.get("Name"), "Adewale Azeez")
})

it('test prev and current cache', () => {
    var konfiger = Konfiger.fromString('')
    
    konfiger.put("Name", "Adewale")
    konfiger.put("Project", "konfiger")
    konfiger.putInt("Year", 2020)
    
    assert.strictEqual(konfiger.getInt("Year"), 2020)
    assert.equal(konfiger.get("Project"), "konfiger")
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.strictEqual(konfiger.getInt("Year"), 2020)
    assert.equal(konfiger.currentCachedObject.ckey, "Name")
    assert.equal(konfiger.prevCachedObject.ckey, "Year")
    assert.equal(konfiger.currentCachedObject.cvalue, "Adewale")
    assert.equal(konfiger.prevCachedObject.cvalue, "2020")
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.equal(konfiger.get("Project"), "konfiger")
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.equal(konfiger.currentCachedObject.ckey, "Project")
    assert.equal(konfiger.prevCachedObject.ckey, "Name")
    assert.equal(konfiger.currentCachedObject.cvalue, "konfiger")
    assert.equal(konfiger.prevCachedObject.cvalue, "Adewale")
})

it('test the single pair commenting in string stream konfiger', () => {
    var ks = KonfigerStream.stringStream("Name:Adewale Azeez,//Project:konfiger,Date:April 24 2020", ':', ',')
    var kon = Konfiger.fromStream(ks)
    for (var entry of kon.entries()) {
        assert.notEqual(entry, "Project")
    }
    assert.equal(kon.size(), 2)
})

it('test contains with lazy load', () => {
    var ks = KonfigerStream.fileStream('test/test.comment.inf')
    ks.setCommentPrefix("[")
    var kon = Konfiger.fromStream(ks, true)
    assert.equal(kon.contains("File"), true)
    assert.equal(kon.contains("Project"), true)
    assert.equal(kon.contains("Author"), true)
})

it('read multiline entry from file stream', () => {
    var ks = KonfigerStream.fileStream("test/test.contd.conf")
    var kon = Konfiger.fromStream(ks)
    
    assert.equal(kon.get("ProgrammingLanguages").indexOf("Kotlin, NodeJS, Powershell, Python, Ring, Rust") > 0, true)
    assert.equal(kon.get("ProjectName"), "konfiger")
    assert.notEqual(kon.get("Description").endsWith(" in other languages and off the Android platform."), false)
})

it('check size in lazyLoad and no lazyLoad', () => {
    var ks = KonfigerStream.fileStream("test/test.contd.conf")
	var kon = Konfiger.fromStream(ks, false)
	var ks1 = KonfigerStream.fileStream("test/test.contd.conf")
	var kon1 = Konfiger.fromStream(ks1, true)

	assert.equal(kon.size() > 0, true)
	assert.equal(kon1.size() > 0, true)
	assert.equal(kon.isEmpty(), false)
	assert.equal(kon1.isEmpty(), false)
	assert.equal(kon1.size(), kon1.size())
})

it('check putComment in the konfiger object', () => {
    var kon = Konfiger.fromString("Name:Adewale Azeez,//Project:konfiger,Date:April 24 2020", false, ':', ',')
    kon.putComment("A comment at the end")
    
    assert.equal(kon.toString().indexOf("//:A comment") > -1, true)
})

it('validate konfiger entries with case sensitivity', () => {
    var kon = Konfiger.fromString(`
String=This is a string
Number=215415245
`, false)

    kon.setCaseSensitivity(true)
    assert.equal(kon.isCaseSensitive(), true)
    assert.throws(function () { 
        assert.equal(kon.get("STRING"), "This is a string")
    }, Error)
    assert.throws(function () { 
        assert.equal(kon.get("NUMBER"), "215415245")
    }, Error)
    
    kon.setCaseSensitivity(false)
    assert.equal(kon.isCaseSensitive(), false)
    assert.equal(kon.get("STRING"), "This is a string")
    assert.equal(kon.get("NUMBER"), "215415245")
    
    assert.equal(kon.get("strING"), "This is a string")
    assert.equal(kon.get("nuMBer"), "215415245")
    
    assert.equal(kon.get("STRiNg"), "This is a string")
    assert.equal(kon.get("nUMbeR"), "215415245")
    
})


