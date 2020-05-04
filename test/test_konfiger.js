
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
    var konfiger = Konfiger.fromFile('test/test.config.ini', true)
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
    assert.equal(konfiger.getBoolean("Two"), true)
    assert.notEqual(konfiger.getBoolean("Two"), false)
    assert.notStrictEqual(konfiger.getBoolean("Two"), "true")
    
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
    assert.equal(konfiger.getLong("TheNumber", 0.12), 0.12)
})

it('remove entry and validate size', () => {
    var konfiger = Konfiger.fromString('One=111,Two=222,Three=333', false, '=', ',')
    
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
    var ks1 = KonfigerStream.fileStream('test/test.txt')
    var konfiger = Konfiger.fromStream(ks, true)
    var konfiger1 = Konfiger.fromStream(ks1, true)
    
    assert.equal(konfiger.get("Hobby"), "i don't know")
    assert.equal(konfiger1.get("Hobby"), konfiger.get("Hobby"))
    assert.equal(konfiger1.get("Hobby"), "i don't know")
    konfiger.save('test/test.config.ini')
    konfiger1.save('test/test.txt')
    
    var newKs = KonfigerStream.fileStream('test/test.config.ini')
    var newKonfiger = Konfiger.fromStream(newKs, true)
    var newKonfiger1 = Konfiger.fromFile('test/test.txt', true)
    assert.equal(konfiger.toString(), newKonfiger.toString())
    assert.equal(konfiger1.toString(), newKonfiger1.toString())
})

it('test complex and confusing seperator', () => {
    var konfiger = Konfiger.fromString(`Occupation=Software En/gineergLocation=Ni/geriagState=La/gos`, false, '=', 'g')
    
    assert.equal(konfiger.size(), 3)
    assert.equal(konfiger.toString().indexOf("/g") > -1, true)
    for (var entry of konfiger.entries()) {
        assert.equal(entry[1].indexOf("/g") > -1, false)
    }
    konfiger.setSeperator('f')
    assert.equal(konfiger.get("Occupation"), "Software Engineer")
    konfiger.setSeperator('\n')
    assert.equal(konfiger.toString().indexOf("/g") > -1, false)
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
    
    assert.equal(konfiger.get("Name"), "Adewale")
    assert.equal(konfiger.get("Project"), "konfiger")
    assert.strictEqual(konfiger.getInt("Year"), 2020)
    assert.equal(konfiger.currentCachedObject.ckey, "Year")
    assert.equal(konfiger.prevCachedObject.ckey, "Project")
    assert.equal(konfiger.currentCachedObject.cvalue, "2020")
    assert.equal(konfiger.prevCachedObject.cvalue, "konfiger")
})

//test and doc putComment
//test the single pair commenting
//add test for other methods
