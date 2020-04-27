
const assert = require('assert')
const { Konfiger, KonfigerStream } = require("../index.js")

it('validate konfiger string stream entries 1', () => {
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

//test prev and current cache
//test and doc putComment
//test the single pair commenting
